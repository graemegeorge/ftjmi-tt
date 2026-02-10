import { fineTuneSchema } from "@/lib/schemas/fineTune";
import type {
  CreateJobPayload,
  JobMutationResponse,
  JobsResponse,
  ModelOption
} from "@/lib/types/jobs";

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  if (!response.ok) {
    const error = (() => {
      if (!text) return { message: "Request failed" };

      try {
        return JSON.parse(text) as { message?: string; error?: string };
      } catch {
        return { message: text };
      }
    })();

    throw new Error(error.message || error.error || "Request failed");
  }

  if (!text || response.status === 204) {
    return null as T;
  }

  return JSON.parse(text) as T;
}

export async function getJobs() {
  const response = await fetch("/api/jobs", { cache: "no-store" });
  return parseResponse<JobsResponse>(response);
}

export async function getModels() {
  const response = await fetch("/api/models", { cache: "no-store" });
  return parseResponse<ModelOption[]>(response);
}

export async function postJob(payload: CreateJobPayload) {
  const validated = fineTuneSchema.parse(payload);
  const response = await fetch("/api/jobs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(validated)
  });

  return parseResponse<JobMutationResponse>(response);
}

export async function deleteJob(jobId: string) {
  const response = await fetch(`/api/jobs/${encodeURIComponent(jobId)}`, {
    method: "DELETE"
  });

  return parseResponse<JobMutationResponse>(response);
}
