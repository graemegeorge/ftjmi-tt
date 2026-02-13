import {
  CreateJobPayload,
  JobMutationResponse,
  JobsResponse,
  ModelOption
} from "@/lib/types/jobs";
import {
  parseExternalJobsResponse,
  parseExternalModelsResponse,
  toExternalCreateJobPayload
} from "@/lib/api/contracts.external";
import { ZodError } from "zod";

const API_BASE_URL =
  process.env.FINE_TUNE_API_BASE_URL || "https://fe-test-api-production-cb39.up.railway.app";

async function externalFetch(path: string, init: RequestInit = {}) {
  if (!process.env.FINE_TUNE_API_KEY) {
    throw new Error("Missing FINE_TUNE_API_KEY environment variable");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.FINE_TUNE_API_KEY,
      ...(init.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const text = await response.text();
    const payload = (() => {
      try {
        return JSON.parse(text);
      } catch {
        return { error: text || "Unknown API error" };
      }
    })();

    throw new ExternalApiError(response.status, payload);
  }

  return response;
}

export async function fetchJobs(): Promise<JobsResponse> {
  const response = await externalFetch("/api/jobs");
  const payload = (await response.json()) as unknown;

  try {
    return parseExternalJobsResponse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ExternalApiError(502, { message: "Invalid jobs response from external API" });
    }

    throw error;
  }
}

export async function fetchModels(): Promise<ModelOption[]> {
  const response = await externalFetch("/api/models");
  const payload = (await response.json()) as unknown;

  try {
    return parseExternalModelsResponse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ExternalApiError(502, { message: "Invalid models response from external API" });
    }

    throw error;
  }
}

export async function createJob(payload: CreateJobPayload): Promise<JobMutationResponse> {
  const requestBody = toExternalCreateJobPayload(payload);
  const response = await externalFetch("/api/jobs", {
    method: "POST",
    body: JSON.stringify(requestBody)
  });

  return response.json();
}

export async function deleteJob(jobId: string): Promise<JobMutationResponse> {
  const response = await externalFetch(`/api/jobs/${encodeURIComponent(jobId)}`, {
    method: "DELETE"
  });

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export class ExternalApiError extends Error {
  status: number;
  payload: unknown;

  constructor(status: number, payload: unknown) {
    super(`External API error: ${status}`);
    this.name = "ExternalApiError";
    this.status = status;
    this.payload = payload;
  }
}
