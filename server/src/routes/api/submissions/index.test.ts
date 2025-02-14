import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { createApp } from "../../../app";
import { FastifyInstance } from "fastify";
import { Submission } from "../../../models/Submission";
import { EntityManager } from "@mikro-orm/postgresql";

describe("POST `/api/submissions` route", () => {
  let app: FastifyInstance | undefined;
  let em: EntityManager;
  const payload = {
    firstName: "john",
    lastName: "doe",
    company: "example",
    phoneNumber: "123123",
    email: "testemail@example.com",
    message: "hello",
  };

  beforeEach(async () => {
    app = createApp();
    await app.ready();

    em = app.orm.em.fork();
  });

  afterEach(async () => {
    await em.nativeDelete(Submission, {
      email: payload.email,
    });
    await app?.close();
  });

  test("POST `/api/submissions` success response with correct data", async () => {
    if (!app) {
      throw new Error("App is not initialized");
    }

    const response = await app.inject({
      method: "POST",
      url: "/api/submissions",
      payload,
    });

    expect(response?.statusCode).toBe(201);
  });

  test("POST `/api/submissions` error response with bad data", async () => {
    if (!app) {
      throw new Error("App is not initialized");
    }

    const response = await app.inject({
      method: "POST",
      url: "/api/submissions",
      payload: {
        bad: "data",
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().message).toContain("must have required property");
  });

  test("POST `/api/submissions` saves to database", async () => {
    if (!app) {
      throw new Error("App is not initialized");
    }

    const response = await app.inject({
      method: "POST",
      url: "/api/submissions",
      payload,
    });

    expect(response.statusCode).toBe(201);

    const submission = await em.findOne(Submission, {
      email: payload.email,
    });

    expect(submission).not.toBeNull();
    expect(submission?.firstName).toBe(payload.firstName);
    expect(submission?.lastName).toBe(payload.lastName);
    expect(submission?.company).toBe(payload.company);
    expect(submission?.phoneNumber).toBe(payload.phoneNumber);
    expect(submission?.email).toBe(payload.email);
    expect(submission?.message).toBe(payload.message);
  });
});
