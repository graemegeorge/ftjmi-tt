import { describe, expect, it, vi } from "vitest";

import { ExternalApiError } from "@/lib/api/server";
import * as serverApi from "@/lib/api/server";

import { GET } from "./route";

vi.mock("@/lib/api/server", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api/server")>("@/lib/api/server");

  return {
    ...actual,
    fetchModels: vi.fn()
  };
});

describe("/api/models route handlers", () => {
  it("returns models for GET", async () => {
    vi.mocked(serverApi.fetchModels).mockResolvedValue([{ id: "a", name: "A" }]);

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual([{ id: "a", name: "A" }]);
  });

  it("passes through external errors for GET", async () => {
    vi.mocked(serverApi.fetchModels).mockRejectedValue(new ExternalApiError(401, { error: "unauthorized" }));

    const response = await GET();

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "unauthorized" });
  });
});

