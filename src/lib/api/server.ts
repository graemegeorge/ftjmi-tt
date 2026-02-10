import {
  CreateJobPayload,
  JobMutationResponse,
  JobStatus,
  JobsResponse,
  ModelOption
} from "@/lib/types/jobs";

const API_BASE_URL =
  process.env.FINE_TUNE_API_BASE_URL || "https://fe-test-api-production-cb39.up.railway.app";

function normalizeStatus(value: unknown): JobStatus {
  const status = String(value ?? "").toLowerCase();
  if (status.includes("complete")) return "completed";
  if (status.includes("fail")) return "failed";
  return "running";
}

function normalizeJob(raw: Record<string, unknown>, index: number) {
  const trainingEpochs = Number(raw.trainingEpochs ?? raw.training_epochs ?? raw.epochs ?? 0);
  const evaluationEpochs = Number(raw.evaluationEpochs ?? raw.evaluation_epochs ?? 0);
  const warmupEpochs = Number(raw.warmupEpochs ?? raw.warmup_epochs ?? 0);
  const learningRate = Number(raw.learningRate ?? raw.learning_rate ?? 0);

  return {
    id: String(raw.id ?? raw.jobId ?? raw.job_id ?? `${raw.name ?? "job"}-${index}`),
    name: String(raw.name ?? raw.jobName ?? raw.job_name ?? "Untitled Job"),
    status: normalizeStatus(raw.status),
    baseModel: String(raw.baseModel ?? raw.base_model ?? raw.model ?? "Unknown model"),
    createdAt: String(raw.createdAt ?? raw.created_at ?? new Date().toISOString()),
    trainingEpochs,
    evaluationEpochs,
    warmupEpochs,
    learningRate
  };
}

function deriveSummary(statuses: JobStatus[]) {
  return statuses.reduce(
    (acc, current) => {
      acc[current] += 1;
      return acc;
    },
    { running: 0, completed: 0, failed: 0 }
  );
}

function mapCreatePayload(payload: CreateJobPayload) {
  return {
    name: payload.jobName,
    baseModel: payload.baseModelId,
    epochs: payload.trainingEpochs,
    evaluationEpochs: payload.evaluationEpochs,
    warmupEpochs: payload.warmupEpochs,
    learningRate: payload.learningRate
  };
}

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

  const jobsSource = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as Record<string, unknown>).jobs)
      ? ((payload as Record<string, unknown>).jobs as unknown[])
      : [];

  const jobs = jobsSource
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((item, index) => normalizeJob(item, index));

  const summaryFromApi = (payload as Record<string, unknown>)?.summary as
    | Record<string, unknown>
    | undefined;
  const derived = deriveSummary(jobs.map((job) => job.status));

  return {
    jobs,
    summary: {
      running: Number(summaryFromApi?.running ?? derived.running),
      completed: Number(summaryFromApi?.completed ?? derived.completed),
      failed: Number(summaryFromApi?.failed ?? derived.failed)
    }
  };
}

export async function fetchModels(): Promise<ModelOption[]> {
  const response = await externalFetch("/api/models");
  const payload = (await response.json()) as unknown;

  const modelsSource = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as Record<string, unknown>).models)
      ? ((payload as Record<string, unknown>).models as unknown[])
      : [];

  return modelsSource
    .map((model) => {
      if (typeof model === "string") {
        return { id: model, name: model };
      }

      if (typeof model === "object" && model !== null) {
        const item = model as Record<string, unknown>;
        const id = String(item.id ?? item.modelId ?? item.model_id ?? item.name ?? "");
        const name = String(item.name ?? item.label ?? item.model_name ?? id);
        return { id, name };
      }

      return null;
    })
    .filter((model): model is ModelOption => Boolean(model?.id));
}

export async function createJob(payload: CreateJobPayload): Promise<JobMutationResponse> {
  const response = await externalFetch("/api/jobs", {
    method: "POST",
    body: JSON.stringify(mapCreatePayload(payload))
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
