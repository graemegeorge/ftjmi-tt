import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { JobsTable } from "./jobs-table";

const mutateAsyncMock = vi.fn();

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock("@/features/jobs/hooks", () => ({
  useDeleteJobMutation: vi.fn(() => ({
    mutateAsync: mutateAsyncMock
  }))
}));

describe("JobsTable", () => {
  it("confirms and runs delete mutation", async () => {
    mutateAsyncMock.mockResolvedValue({ deleted: true });

    render(
      <JobsTable
        jobs={[
          {
            id: "job-1",
            name: "Job One",
            status: "running",
            baseModel: "base",
            createdAt: "2026-01-01T00:00:00.000Z",
            trainingEpochs: 5,
            evaluationEpochs: 1,
            warmupEpochs: 1,
            learningRate: 0.001
          }
        ]}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Delete Job One" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete job" }));

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith("job-1");
    });
  });
});
