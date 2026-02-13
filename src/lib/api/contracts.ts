import type { JobMutationResponse, JobsResponse, ModelOption } from "@/lib/types/jobs";
import { z } from "zod";

const summarySchema = z.object({
  running: z.number().int().nonnegative(),
  completed: z.number().int().nonnegative(),
  failed: z.number().int().nonnegative()
});

const jobMutationPayloadSchema = z.record(z.unknown()).nullable();

export function parseInternalJobsResponse(payload: unknown): JobsResponse {
  return z
    .object({
      jobs: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          status: z.enum(["running", "completed", "failed"]),
          baseModel: z.string(),
          createdAt: z.string(),
          trainingEpochs: z.number(),
          evaluationEpochs: z.number(),
          warmupEpochs: z.number(),
          learningRate: z.number()
        })
      ),
      summary: summarySchema
    })
    .parse(payload);
}

export function parseInternalModelsResponse(payload: unknown): ModelOption[] {
  return z.array(z.object({ id: z.string().min(1), name: z.string() })).parse(payload);
}

export function parseInternalJobMutationResponse(payload: unknown): JobMutationResponse {
  return jobMutationPayloadSchema.parse(payload);
}
