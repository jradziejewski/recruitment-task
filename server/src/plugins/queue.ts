import fp from "fastify-plugin";
import { Static, TSchema } from "@sinclair/typebox";
import IORedis from "ioredis";
import { ajv } from "../utilities/ajv";
import { FastifyInstance } from "fastify";
import { RequestContext } from "@mikro-orm/core";
import { JobsOptions, Queue, Worker } from "bullmq";
import assert from "node:assert";
import { ValidateFunction } from "ajv";

export interface QueueJobInterface<T extends TSchema> {
  name: string;
  validate: ValidateFunction;
  run(data: Static<T>, fastify: FastifyInstance): Promise<unknown>;
}

type QueueManager = {
  register(job: QueueJobInterface<any>): void;
  schedule<T extends TSchema>(
    job: QueueJobInterface<T>,
    args: Static<T>,
    options?: JobsOptions,
  ): Promise<void>;
};

declare module "fastify" {
  interface FastifyInstance {
    queue: QueueManager;
  }
}

export function defineJob<T extends TSchema>(
  name: string,
  schema: T,
  handler: QueueJobInterface<T>["run"],
): QueueJobInterface<T> {
  const job: QueueJobInterface<T> = {
    name,
    validate: ajv.compile(schema),
    async run(args: Static<T>, fastify: FastifyInstance): Promise<unknown> {
      const start = performance.now();
      fastify.log.info(`Job '${name}' started`);

      if (!job.validate(args)) {
        throw new Error(
          `Invalid job '${job}' args: ${JSON.stringify(job.validate.errors)}`,
        );
      }

      const result = await RequestContext.create(fastify.orm.em, () =>
        handler(args, fastify),
      );

      fastify.log.info(
        `Job '${name}' finished, took ${performance.now() - start}ms`,
      );

      return result;
    },
  };

  return job;
}

export default fp<{
  connection: string;
}>(
  async (fastify, opts) => {
    const queues: Map<QueueJobInterface<any>, [Queue, Worker]> = new Map();

    const connection = new IORedis(opts.connection, {
      maxRetriesPerRequest: null,
      retryStrategy(times) {
        return Math.min(Math.pow(2, times - 1) * 1000, 30000);
      },
    });

    connection.on("error", (error) => {
      fastify.log.error(error);
    });

    fastify.decorate<QueueManager>("queue", {
      async schedule<T extends TSchema>(
        job: QueueJobInterface<T>,
        args: Static<T>,
        options?: JobsOptions,
      ): Promise<void> {
        if (!job.validate(args)) {
          throw new Error(
            `Invalid job '${job}' args: ${JSON.stringify(job.validate.errors)}`,
          );
        }

        const [queue] = queues.get(job) ?? [];
        assert.ok(queue);
        await queue.add(job.name, args, options);
      },

      register<T extends TSchema>(job: QueueJobInterface<T>) {
        const queue = new Queue(job.name, {
          connection,
          defaultJobOptions: {
            attempts: Number.MAX_SAFE_INTEGER,
            backoff: {
              type: "exponential",
              delay: 1000,
            },
          },
        });

        const worker = new Worker<Static<T>>(
          job.name,
          async ({ data }) => {
            return job.run(data, fastify);
          },
          {
            connection,
            autorun: false,
          },
        );

        queues.set(job, [queue, worker]);

        worker.on("error", (err) => {
          fastify.log.error(err);
        });
      },
    });

    fastify.addHook("onReady", async () => {
      await Promise.all(
        [...queues.values()].map(async ([_, worker]) => {
          void worker.run();
          await worker.waitUntilReady();
        }),
      );
    });

    fastify.addHook("onClose", async () => {
      await Promise.all(
        [...queues.values()].map(async ([queue, worker]) =>
          Promise.all([queue.close(), worker.close()]),
        ),
      );
      connection.disconnect();
    });
  },
  {
    name: "queue",
  },
);

export const autoConfig = {
  connection: process.env.REDIS_CONNECTION ?? "redis://127.0.0.1:6379",
};
