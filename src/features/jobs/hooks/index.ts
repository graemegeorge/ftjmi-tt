"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { deleteJob, getJobs, getModels, postJob } from "@/lib/api/client";
import type { CreateJobPayload, JobsResponse } from "@/lib/types/jobs";

export const JOBS_QUERY_KEY = ["jobs"] as const;
export const MODELS_QUERY_KEY = ["models"] as const;

interface UseJobsQueryOptions {
  initialData?: JobsResponse;
}

export function useJobsQuery(options?: UseJobsQueryOptions) {
  return useQuery({
    queryKey: JOBS_QUERY_KEY,
    queryFn: getJobs,
    initialData: options?.initialData
  });
}

export function useModelsQuery() {
  return useQuery({
    queryKey: MODELS_QUERY_KEY,
    queryFn: getModels
  });
}

export function useCreateJobMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateJobPayload) => postJob(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
    }
  });
}

export function useDeleteJobMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => deleteJob(jobId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
    }
  });
}
