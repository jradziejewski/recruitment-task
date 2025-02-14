import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import { createApp } from "../../../app";
import { Submission } from "../../../models/Submission";
import { EntityManager } from "@mikro-orm/postgresql";
import { submissionConfirmationEmailJob } from "../../../jobs/SubmissionConfirmationEmail";

describe("POST `/api/submissions` route", () => {
  const app = createApp();
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
    await app.ready();

    em = app.orm.em.fork();
  });

  afterEach(async () => {
    await em.nativeDelete(Submission, {
      email: payload.email,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  test("should return success response with correct data", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/submissions",
      payload,
    });
    expect(response.statusCode).toBe(201);

    expect(response.json().message).toContain("New submission created");
    expect(response.json().submission.firstName).toContain(payload.firstName);
    expect(response.json().submission.lastName).toContain(payload.lastName);
    expect(response.json().submission.company).toContain(payload.company);
    expect(response.json().submission.phoneNumber).toContain(
      payload.phoneNumber,
    );
    expect(response.json().submission.email).toContain(payload.email);
    expect(response.json().submission.message).toContain(payload.message);
  });

  test("should return error response with bad data", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/submissions",
      payload: {
        ...payload,
        company: "",
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toStrictEqual({
      statusCode: 400,
      code: "FST_ERR_VALIDATION",
      error: "Bad Request",
      message: "body/company must NOT have fewer than 1 characters",
    });
  });

  test("should save to database", async () => {
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

  test("should schedule sending email confirmation job", async () => {
    const queueSpy = vi
      .spyOn(app.queue, "schedule")
      .mockResolvedValue(undefined);

    const response = await app.inject({
      method: "POST",
      url: "/api/submissions",
      payload,
    });

    expect(response.statusCode).toBe(201);

    const submission = await em.findOne(Submission, {
      email: payload.email,
    });

    expect(queueSpy).toHaveBeenCalledWith(submissionConfirmationEmailJob, {
      id: submission?.id,
      firstName: submission?.firstName,
      recipientEmail: submission?.email,
    });
  });

  test("should handle job scheduling failure", async () => {
    vi.spyOn(app.queue, "schedule").mockRejectedValue(
      new Error("Server error description"),
    );

    const response = await app.inject({
      method: "POST",
      url: "/api/submissions",
      payload,
    });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toHaveProperty("message", "Internal Server Error");
  });
});
