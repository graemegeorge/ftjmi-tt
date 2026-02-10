import { afterEach, describe, expect, it, vi } from "vitest";

import { deleteJob, getJobs, postJob } from "@/lib/api/client";

describe("client API wrappers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("parses successful jobs response", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ jobs: [], summary: { running: 0, completed: 0, failed: 0 } }))
    );

    await expect(getJobs()).resolves.toEqual({
      jobs: [],
      summary: { running: 0, completed: 0, failed: 0 }
    });
  });

  it("surfaces message field from failed response", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "Bad request" }), { status: 400 })
    );

    await expect(getJobs()).rejects.toThrow("Bad request");
  });

  it("surfaces error field from failed response", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    );

    await expect(getJobs()).rejects.toThrow("Unauthorized");
  });

  it("surfaces plain text from failed response", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(new Response("Unavailable", { status: 503 }));

    await expect(getJobs()).rejects.toThrow("Unavailable");
  });

  it("returns null for delete 204 response", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(new Response(null, { status: 204 }));

    await expect(deleteJob("job-id")).resolves.toBeNull();
  });

  it("validates payload before posting", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(new Response(JSON.stringify({ created: true })));

    await expect(
      postJob({
        jobName: "invalid name",
        baseModelId: "base-1",
        trainingEpochs: 10,
        evaluationEpochs: 1,
        warmupEpochs: 1,
        learningRate: 0.01
      })
    ).rejects.toThrow();
  });
});
