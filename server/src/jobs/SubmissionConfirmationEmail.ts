import { FastifyPluginAsync } from "fastify";
import { defineJob } from "../plugins/queue";
import { Type } from "@sinclair/typebox";

export const submissionConfirmationEmailJob = defineJob(
  "SubmissionConfirmationEmail",
  Type.Object({
    id: Type.String({ format: "uuid" }),
    firstName: Type.String(),
    recipientEmail: Type.String(),
  }),
  async ({ id, firstName, recipientEmail }, fastify) => {
    await fastify.mail.send("submission-confirmation", {
      id,
      recipientEmail,
      firstName,
    });
  },
);

const plugin: FastifyPluginAsync = async (fastify) => {
  fastify.queue.register(submissionConfirmationEmailJob);
};
export default plugin;
