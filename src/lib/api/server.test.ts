import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createJob, deleteJob, ExternalApiError, fetchJobs, fetchModels } from "@/lib/api/server";

describe("server API adapter", () => {
  const originalApiKey = process.env.FINE_TUNE_API_KEY;
  const originalBaseUrl = process.env.FINE_TUNE_API_BASE_URL;

  beforeEach(() => {
    process.env.FINE_TUNE_API_KEY = "test-api-key";
    process.env.FINE_TUNE_API_BASE_URL = "https://example.com";
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env.FINE_TUNE_API_KEY = originalApiKey;
    process.env.FINE_TUNE_API_BASE_URL = originalBaseUrl;
  });

  it("normalizes jobs payload using the external API contract", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          jobs: [
            {
              id: "job-1",
              name: "Training",
              status: "Completed",
              baseModel: "base-1",
              date: "2026-01-01T00:00:00.000Z",
              createdAt: "2026-01-01T00:00:00.000Z",
              epochs: 4,
              evaluationEpochs: 1,
              warmupEpochs: 1,
              learningRate: 0.0001
            }
          ],
          summary: {
            running: 0,
            completed: 1,
            failed: 0
          }
        })
      )
    );

    const result = await fetchJobs();

    expect(result.summary).toEqual({
      running: 0,
      completed: 1,
      failed: 0
    });
    expect(result.jobs[0]).toMatchObject({
      id: "job-1",
      name: "Training",
      baseModel: "base-1",
      trainingEpochs: 4
    });
  });

  it("normalizes model payload shapes from the external contract", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify([
          { id: "model-a", displayName: "Model A" },
          { id: "model-b", displayName: "Model B" }
        ])
      )
    );

    const result = await fetchModels();

    expect(result).toEqual([
      { id: "model-a", name: "Model A" },
      { id: "model-b", name: "Model B" }
    ]);
  });

  it("throws 502 ExternalApiError for invalid jobs response shape", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          jobs: []
        })
      )
    );

    await expect(fetchJobs()).rejects.toMatchObject({
      status: 502,
      payload: { message: "Invalid jobs response from external API" }
    });
  });

  it("throws 502 ExternalApiError for invalid models response shape", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          models: ["model-a"]
        })
      )
    );

    await expect(fetchModels()).rejects.toMatchObject({
      status: 502,
      payload: { message: "Invalid models response from external API" }
    });
  });

  it("throws ExternalApiError for non-2xx responses", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    );

    try {
      await fetchJobs();
      throw new Error("Expected fetchJobs to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(ExternalApiError);
      expect(error).toMatchObject({
        status: 401,
        payload: { error: "Unauthorized" }
      });
    }
  });

  it("maps create payload to external contract", async () => {
    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response(JSON.stringify({ id: "ok" })));

    await createJob({
      jobName: "my-job",
      baseModelId: "base-model",
      trainingEpochs: 10,
      evaluationEpochs: 3,
      warmupEpochs: 1,
      learningRate: 0.001
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://fe-test-api-production-cb39.up.railway.app/api/jobs",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          name: "my-job",
          baseModel: "base-model",
          epochs: 10,
          evaluationEpochs: 3,
          warmupEpochs: 1,
          learningRate: 0.001
        })
      })
    );
  });

  it("returns null on 204 delete response", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(new Response(null, { status: 204 }));

    await expect(deleteJob("job-1")).resolves.toBeNull();
  });
});
