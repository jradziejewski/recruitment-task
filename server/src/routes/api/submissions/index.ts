import { FastifyPluginAsync } from "fastify";
import { Submission } from "../../../models/Submission";
import { submissionConfirmationEmailJob } from "../../../jobs/SubmissionConfirmationEmail";
import { Type } from "@sinclair/typebox";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

const plugin: FastifyPluginAsync = async (fastify) => {
  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    "/",
    {
      schema: {
        body: Type.Object({
          firstName: Type.String({ minLength: 1, maxLength: 50 }),
          lastName: Type.String({ minLength: 1, maxLength: 50 }),
          company: Type.String({ minLength: 1, maxLength: 100 }),
          phoneNumber: Type.String({ minLength: 1, maxLength: 20 }),
          email: Type.String({ format: "email", maxLength: 254 }),
          message: Type.String({ minLength: 1, maxLength: 1000 }),
        }),
      },
    },
    async (request, response) => {
      let submission!: Submission;

      await fastify.orm.em.transactional(async (em) => {
        submission = em.create(Submission, request.body);
        await em.persistAndFlush(submission);

        em.getEventManager().registerSubscriber({
          async afterTransactionCommit() {
            await fastify.queue.schedule(submissionConfirmationEmailJob, {
              id: submission.id,
              firstName: submission.firstName,
              recipientEmail: submission.email,
            });
          },
        });
      });

      response.status(201).send({
        message: "New submission created",
        submission: submission,
      });
    },
  );
};
export default plugin;
