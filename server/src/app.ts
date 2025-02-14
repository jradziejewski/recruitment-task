import fastify from "fastify";
import autoload from "@fastify/autoload";
import path from "node:path";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

export function createApp() {
  const app = fastify({
    logger: { transport: { target: "pino-pretty" } },
  }).withTypeProvider<TypeBoxTypeProvider>();

  // Plugins
  app.register(autoload, {
    dir: path.join(__dirname, "plugins"),
    ignoreFilter: (path) => path.endsWith(".test.ts"),
  });

  // Jobs
  app.register(autoload, {
    dir: path.join(__dirname, "jobs"),
    ignoreFilter: (path) => path.endsWith(".test.ts"),
  });

  // Routes
  app.register(autoload, {
    dir: path.join(__dirname, "routes"),
    ignoreFilter: (path) => path.endsWith(".test.ts"),
  });

  app.get("/health", (_, reply) => {
    void reply.code(200).send("ok");
  });

  return app;
}
