import { schemas as generatedSchemas } from "@/lib/api/generated/openapi.zod";
import type { CreateJobPayload, JobsResponse, ModelOption } from "@/lib/types/jobs";
import { z } from "zod";

const summarySchema = z.object({
  running: z.number().int().nonnegative(),
  completed: z.number().int().nonnegative(),
  failed: z.number().int().nonnegative()
});

const externalJobsPayloadSchema = z.object({
  jobs: z.array(generatedSchemas.Job),
  summary: summarySchema
});

const externalModelsPayloadSchema = z.array(generatedSchemas.Model);

const statusMap = {
  Running: "running",
  Completed: "completed",
  Failed: "failed"
} as const;

function mapJob(job: z.infer<typeof generatedSchemas.Job>): JobsResponse["jobs"][number] {
  return {
    id: job.id,
    name: job.name,
    status: statusMap[job.status],
    baseModel: job.baseModel,
    createdAt: job.createdAt ?? job.date,
    trainingEpochs: job.epochs,
    evaluationEpochs: job.evaluationEpochs,
    warmupEpochs: job.warmupEpochs,
    learningRate: job.learningRate
  };
}

export function parseExternalJobsResponse(payload: unknown): JobsResponse {
  const parsed = externalJobsPayloadSchema.parse(payload);
  return {
    jobs: parsed.jobs.map(mapJob),
    summary: parsed.summary
  };
}

export function parseExternalModelsResponse(payload: unknown): ModelOption[] {
  const parsed = externalModelsPayloadSchema.parse(payload);
  return parsed.map((model) => ({
    id: model.id,
    name: model.displayName
  }));
}

export function toExternalCreateJobPayload(payload: CreateJobPayload) {
  return {
    name: payload.jobName,
    baseModel: payload.baseModelId,
    epochs: payload.trainingEpochs,
    evaluationEpochs: payload.evaluationEpochs,
    warmupEpochs: payload.warmupEpochs,
    learningRate: payload.learningRate
  };
}
