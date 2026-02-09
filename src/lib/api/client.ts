import { fineTuneSchema } from "@/lib/schemas/fineTune";
import type { CreateJobPayload, JobsResponse, ModelOption } from "@/lib/types/jobs";

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }
  return response.json() as Promise<T>;
}

export async function getJobs() {
  const response = await fetch("/api/jobs", { cache: "no-store" });
  return parseJson<JobsResponse>(response);
}

export async function getModels() {
  const response = await fetch("/api/models", { cache: "no-store" });
  return parseJson<ModelOption[]>(response);
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

  return parseJson<unknown>(response);
}
