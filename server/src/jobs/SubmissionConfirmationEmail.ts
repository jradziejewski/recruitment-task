import { FastifyPluginAsync } from "fastify";
import { defineJob } from "../plugins/queue";
import { Type } from "@sinclair/typebox";

export const submissionConfirmationEmailJob = defineJob(
  "SubmissionConfirmationEmail",
  Type.Object({
    id: Type.String({ format: "uuid" }),
  }),
  async ({ id }) => {
    // TODO: Should send an email
  },
);

const plugin: FastifyPluginAsync = async (fastify) => {
  fastify.queue.register(submissionConfirmationEmailJob);
};
export default plugin;
