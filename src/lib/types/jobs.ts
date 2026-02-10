export type JobStatus = "running" | "completed" | "failed";

export interface JobSummary {
  running: number;
  completed: number;
  failed: number;
}

export interface FineTuneJob {
  id: string;
  name: string;
  status: JobStatus;
  baseModel: string;
  createdAt: string;
  trainingEpochs: number;
  evaluationEpochs: number;
  warmupEpochs: number;
  learningRate: number;
}

export interface JobsResponse {
  jobs: FineTuneJob[];
  summary: JobSummary;
}

export interface ModelOption {
  id: string;
  name: string;
}

export interface CreateJobPayload {
  jobName: string;
  baseModelId: string;
  trainingEpochs: number;
  evaluationEpochs: number;
  warmupEpochs: number;
  learningRate: number;
}

export type JobMutationResponse = Record<string, unknown> | null;
