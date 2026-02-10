import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppProviders } from "@/providers/app-providers";

import { Step1Form } from "./step-1-form";
import { Step2Form } from "./step-2-form";
import { Step3Form } from "./step-3-form";

const pushMock = vi.fn();
const replaceMock = vi.fn();
const createMutationMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: replaceMock
  }),
  usePathname: () => "/jobs/new/step-2"
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock("@/features/jobs/hooks", () => ({
  useModelsQuery: vi.fn(),
  useCreateJobMutation: vi.fn()
}));

function renderWithProviders(ui: ReactNode) {
  return render(<AppProviders>{ui}</AppProviders>);
}

describe("step flow components", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    localStorage.clear();

    const hooks = await import("@/features/jobs/hooks");
    vi.mocked(hooks.useModelsQuery).mockReturnValue({
      data: [{ id: "model-1", name: "Model 1" }],
      isLoading: false,
      isError: false
    } as ReturnType<typeof hooks.useModelsQuery>);
    vi.mocked(hooks.useCreateJobMutation).mockReturnValue({
      mutateAsync: createMutationMock,
      isPending: false
    } as unknown as ReturnType<typeof hooks.useCreateJobMutation>);
    createMutationMock.mockResolvedValue({ id: "job-1" });
  });

  it("redirects step 2 to step 1 when required draft values are missing", async () => {
    renderWithProviders(<Step2Form />);

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/jobs/new/step-1");
    });
  });

  it("submits step 1 and routes to step 2", async () => {
    renderWithProviders(<Step1Form />);

    fireEvent.change(screen.getByLabelText("Job name"), { target: { value: "my-job" } });
    fireEvent.change(screen.getByLabelText("Base model"), { target: { value: "model-1" } });
    fireEvent.click(screen.getByRole("button", { name: "Next: Configure" }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/jobs/new/step-2");
    });
  });

  it("submits step 3 with merged draft values and routes to dashboard", async () => {
    localStorage.setItem(
      "fine-tune-draft",
      JSON.stringify({
        jobName: "my-job",
        baseModelId: "model-1",
        trainingEpochs: 5,
        evaluationEpochs: 1,
        warmupEpochs: 1,
        learningRate: 0.001
      })
    );

    renderWithProviders(<Step3Form />);

    fireEvent.click(screen.getByRole("button", { name: "Start fine-tuning" }));

    await waitFor(() => {
      expect(createMutationMock).toHaveBeenCalledWith({
        jobName: "my-job",
        baseModelId: "model-1",
        trainingEpochs: 5,
        evaluationEpochs: 1,
        warmupEpochs: 1,
        learningRate: 0.001
      });
    });

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/");
    });
  });
});
