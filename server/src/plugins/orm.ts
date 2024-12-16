import fp from "fastify-plugin";
import { MikroORM, RequestContext } from "@mikro-orm/core";
import type { FastifyPluginAsync } from "fastify";
import { AbstractSqlDriver } from "@mikro-orm/postgresql";
import config from "../mikro-orm.config";

declare module "fastify" {
  interface FastifyInstance {
    orm: MikroORM<AbstractSqlDriver>;
  }
}

const plugin: FastifyPluginAsync<never> = async (fastify) => {
  const orm = await MikroORM.init<AbstractSqlDriver>(config);

  fastify.decorate("orm", orm);

  fastify.addHook("onRequest", (_req, _res, next) =>
    RequestContext.create(fastify.orm.em, next),
  );

  fastify.addHook("onClose", () => orm.close());
};

export default fp(plugin, {
  name: "orm",
});
