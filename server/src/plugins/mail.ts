import fp from "fastify-plugin";
import type { FastifyPluginAsync } from "fastify";

type Templates = {
  "submission-confirmation": {
    id: string;
    firstName: string;
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
  // TODO: Implement the plugin, use maildev?
  fastify.decorate("mail", null);
};

export default fp(plugin, {
  name: "orm",
});
