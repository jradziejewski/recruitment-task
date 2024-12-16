import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { createApp } from "./app.js";
import { FastifyInstance } from "fastify";

describe("app", () => {
  let app: FastifyInstance | undefined;

  beforeEach(async () => {
    app = createApp();
  });

  afterEach(async () => {
    await app?.close();
  });

  test("health", async () => {
    const response = await app!.inject({
      method: "GET",
      url: "/health",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("ok");
  });

  test("not found", async () => {
    const response = await app!.inject({
      method: "GET",
      url: "/non-existing-path",
    });

    expect(response.statusCode).toBe(404);
  });
});
