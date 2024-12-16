import { FastifyPluginAsync } from "fastify";
import { Submission } from "../models/Submission";
import { submissionConfirmationEmailJob } from "../jobs/SubmissionConfirmationEmail";
import { Type } from "@sinclair/typebox";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

const plugin: FastifyPluginAsync = async (fastify) => {
  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    "/",
    {
      schema: {
        body: Type.Object({
          firstName: Type.String(),
        }),
      },
    },
    async (_request) => {
      await fastify.orm.em.transactional((em) => {
        // TODO: Should store a new submission
        const submission: Submission = null;

        em.getEventManager().registerSubscriber({
          async afterTransactionCommit() {
            await fastify.queue.schedule(submissionConfirmationEmailJob, {
              id: submission.id,
            });
          },
        });
      });
    },
  );
};
export default plugin;
