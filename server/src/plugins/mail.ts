import fp from "fastify-plugin";
import nodemailer from "nodemailer";
import type { FastifyPluginAsync } from "fastify";

type Templates = {
  "submission-confirmation": {
    id: string;
    firstName: string;
    recipientEmail: string;
  };
};

type MailPlugin = {
  send<T extends keyof Templates>(
    template: T,
    data: Templates[T],
  ): Promise<void>;
};

declare module "fastify" {
  interface FastifyInstance {
    mail: MailPlugin;
  }
}

const plugin: FastifyPluginAsync<never> = async (fastify) => {
  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 1025,
    secure: false,
  });
  fastify.decorate("mail", {
    async send<T extends keyof Templates>(template: T, data: Templates[T]) {
      if (template === "submission-confirmation") {
        const { id, firstName, recipientEmail } =
          data as Templates["submission-confirmation"];
        await transporter.sendMail({
          from: "no-reply@example.com",
          to: recipientEmail,
          subject: "Submission Confirmation",
          text: `Hello ${firstName}!\n\n Your submission has been received.\n\nSubmission ID: ${id}`,
        });
        fastify.log.info(`Email for submission ${id} sent`);
      } else {
        throw new Error(`Template unknown: ${template}`);
      }
    },
  });
};

export default fp(plugin, {
  name: "mail",
});
