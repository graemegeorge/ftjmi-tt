import { fineTuneSchema } from "@/lib/schemas/fineTune";
import {
  parseInternalJobMutationResponse,
  parseInternalJobsResponse,
  parseInternalModelsResponse
} from "@/lib/api/contracts";
import type {
  CreateJobPayload,
  JobMutationResponse,
  JobsResponse,
  ModelOption
} from "@/lib/types/jobs";
import { z } from "zod";

const errorPayloadSchema = z
  .object({
    message: z.string().optional(),
    error: z.string().optional()
  })
  .passthrough();

async function parseResponse<T>(response: Response, parse: (payload: unknown) => T): Promise<T> {
  const text = await response.text();

  if (!response.ok) {
    const message = (() => {
      if (!text) return { message: "Request failed" };

      try {
        const parsed = errorPayloadSchema.safeParse(JSON.parse(text));
        if (parsed.success) {
          return parsed.data;
        }

        return { message: "Request failed" };
      } catch {
        return { message: text };
      }
    })();

    throw new Error(message.message || message.error || "Request failed");
  }

  if (!text || response.status === 204) {
    return parse(null);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON response");
  }

  return parse(payload);
}

export async function getJobs(): Promise<JobsResponse> {
  const response = await fetch("/api/jobs", { cache: "no-store" });
  return parseResponse(response, parseInternalJobsResponse);
}

export async function getModels(): Promise<ModelOption[]> {
  const response = await fetch("/api/models", { cache: "no-store" });
  return parseResponse(response, parseInternalModelsResponse);
}

export async function postJob(payload: CreateJobPayload): Promise<JobMutationResponse> {
  const validated = fineTuneSchema.parse(payload);
  const response = await fetch("/api/jobs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(validated)
  });

  return parseResponse(response, parseInternalJobMutationResponse);
}

export async function deleteJob(jobId: string): Promise<JobMutationResponse> {
  const response = await fetch(`/api/jobs/${encodeURIComponent(jobId)}`, {
    method: "DELETE"
  });

  return parseResponse(response, parseInternalJobMutationResponse);
}
