import { describe, expect, it, vi } from "vitest";

import { ExternalApiError } from "@/lib/api/server";
import * as serverApi from "@/lib/api/server";

import { DELETE } from "./route";

vi.mock("@/lib/api/server", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api/server")>("@/lib/api/server");

  return {
    ...actual,
    deleteJob: vi.fn()
  };
});

describe("/api/jobs/[id] route handlers", () => {
  it("returns 204 when deletion result is null", async () => {
    vi.mocked(serverApi.deleteJob).mockResolvedValue(null);

    const response = await DELETE(new Request("http://localhost/api/jobs/job-1"), {
      params: Promise.resolve({ id: "job-1" })
    });

    expect(response.status).toBe(204);
  });

  it("returns payload when deletion returns data", async () => {
    vi.mocked(serverApi.deleteJob).mockResolvedValue({ deleted: true });

    const response = await DELETE(new Request("http://localhost/api/jobs/job-1"), {
      params: Promise.resolve({ id: "job-1" })
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ deleted: true });
  });

  it("passes through external errors", async () => {
    vi.mocked(serverApi.deleteJob).mockRejectedValue(
      new ExternalApiError(503, { error: "downstream" })
    );

    const response = await DELETE(new Request("http://localhost/api/jobs/job-1"), {
      params: Promise.resolve({ id: "job-1" })
    });

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({ error: "downstream" });
  });
});
