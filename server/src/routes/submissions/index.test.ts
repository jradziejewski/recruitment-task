import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { createApp } from "../../app";
import { FastifyInstance } from "fastify";

describe("POST `/submissions` route", () => {
  let app: FastifyInstance | undefined;

  beforeEach(async () => {
    app = await createApp();
  });

  afterEach(async () => {
    await app?.close();
  });

  test("creates submission and sends confirmation", async () => {
    // TODO
    expect.fail();
  });
});
