import { describe, expect, it, vi } from "vitest";

import { ExternalApiError } from "@/lib/api/server";
import * as serverApi from "@/lib/api/server";

import { GET, POST } from "./route";

vi.mock("@/lib/api/server", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api/server")>("@/lib/api/server");

  return {
    ...actual,
    fetchJobs: vi.fn(),
    createJob: vi.fn()
  };
});

describe("/api/jobs route handlers", () => {
  it("returns jobs for GET", async () => {
    vi.mocked(serverApi.fetchJobs).mockResolvedValue({
      jobs: [],
      summary: { running: 0, completed: 0, failed: 0 }
    });

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      jobs: [],
      summary: { running: 0, completed: 0, failed: 0 }
    });
  });

  it("passes through external errors for GET", async () => {
    vi.mocked(serverApi.fetchJobs).mockRejectedValue(
      new ExternalApiError(429, { error: "Rate limit" })
    );

    const response = await GET();

    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toEqual({ error: "Rate limit" });
  });

  it("returns 400 on invalid POST payload", async () => {
    const request = new Request("http://localhost/api/jobs", {
      method: "POST",
      body: JSON.stringify({})
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it("creates job for valid POST", async () => {
    vi.mocked(serverApi.createJob).mockResolvedValue({ id: "new-id" });

    const request = new Request("http://localhost/api/jobs", {
      method: "POST",
      body: JSON.stringify({
        jobName: "train-job",
        baseModelId: "base-model",
        trainingEpochs: 10,
        evaluationEpochs: 2,
        warmupEpochs: 1,
        learningRate: 0.0005
      })
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({ id: "new-id" });
  });

  it("passes through external errors for POST", async () => {
    vi.mocked(serverApi.createJob).mockRejectedValue(
      new ExternalApiError(503, { error: "unavailable" })
    );

    const request = new Request("http://localhost/api/jobs", {
      method: "POST",
      body: JSON.stringify({
        jobName: "train-job",
        baseModelId: "base-model",
        trainingEpochs: 10,
        evaluationEpochs: 2,
        warmupEpochs: 1,
        learningRate: 0.0005
      })
    });

    const response = await POST(request);

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({ error: "unavailable" });
  });
});
