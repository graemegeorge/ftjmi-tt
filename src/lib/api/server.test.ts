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

  it("normalizes jobs payload and derives summary fallback", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          jobs: [
            {
              job_id: "job-1",
              job_name: "Training",
              status: "completed",
              base_model: "base-1",
              created_at: "2026-01-01T00:00:00.000Z",
              epochs: 4,
              evaluation_epochs: 1,
              warmup_epochs: 1,
              learning_rate: 0.0001
            },
            {
              id: "job-2",
              name: "Another",
              status: "failed",
              baseModel: "base-2",
              createdAt: "2026-01-02T00:00:00.000Z",
              trainingEpochs: 2,
              evaluationEpochs: 1,
              warmupEpochs: 1,
              learningRate: 0.0002
            }
          ]
        })
      )
    );

    const result = await fetchJobs();

    expect(result.summary).toEqual({
      running: 0,
      completed: 1,
      failed: 1
    });
    expect(result.jobs[0]).toMatchObject({
      id: "job-1",
      name: "Training",
      baseModel: "base-1",
      trainingEpochs: 4
    });
  });

  it("normalizes mixed model payload shapes", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          models: ["model-a", { model_id: "model-b", model_name: "Model B" }]
        })
      )
    );

    const result = await fetchModels();

    expect(result).toEqual([
      { id: "model-a", name: "model-a" },
      { id: "model-b", name: "Model B" }
    ]);
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
