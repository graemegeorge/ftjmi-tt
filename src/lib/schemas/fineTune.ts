import { z } from "zod";

export const step1Schema = z.object({
  jobName: z
    .string()
    .min(3, "Job name must be at least 3 characters")
    .max(50, "Job name cannot exceed 50 characters")
    .regex(/^[a-zA-Z0-9-]+$/, "Only alphanumeric characters and dashes are allowed"),
  baseModelId: z.string().min(1, "Select a base model")
});

const epochsShape = {
  trainingEpochs: z.coerce.number().int().min(1, "Training epochs must be at least 1"),
  evaluationEpochs: z.coerce.number().int().min(0, "Evaluation epochs cannot be negative"),
  warmupEpochs: z.coerce.number().int().min(0, "Warm-up epochs cannot be negative")
};

const learningRateShape = {
  learningRate: z.coerce
    .number()
    .gt(0, "Learning rate must be greater than 0")
    .max(1, "Learning rate must not exceed 1")
};

const withEpochGuards = <T extends z.ZodTypeAny>(schema: T) =>
  schema.superRefine((data: z.infer<T>, ctx: z.RefinementCtx) => {
    const epochs = data as {
      trainingEpochs: number;
      evaluationEpochs: number;
      warmupEpochs: number;
    };
    if (epochs.evaluationEpochs + epochs.warmupEpochs > epochs.trainingEpochs) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["evaluationEpochs"],
        message: "Evaluation epochs must be less than or equal to training epochs minus warm-up epochs"
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["warmupEpochs"],
        message: "Warm-up epochs must be less than or equal to training epochs minus evaluation epochs"
      });
    }
  });

export const step2Schema = withEpochGuards(
  z.object({
    ...epochsShape,
    ...learningRateShape
  })
);

export const step3Schema = z.object({});

export const fineTuneSchema = withEpochGuards(
  z.object({
    jobName: step1Schema.shape.jobName,
    baseModelId: step1Schema.shape.baseModelId,
    ...epochsShape,
    ...learningRateShape
  })
);

export type Step1Values = z.infer<typeof step1Schema>;
export type Step2Values = z.infer<typeof step2Schema>;
export type Step3Values = z.infer<typeof step3Schema>;
export type FineTuneValues = z.infer<typeof fineTuneSchema>;
