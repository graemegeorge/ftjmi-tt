import { describe, expect, it } from "vitest";

import { fineTuneSchema, step1Schema, step2Schema, step3Schema } from "@/lib/schemas/fineTune";

describe("fineTune schemas", () => {
  it("validates step 1 values", () => {
    expect(step1Schema.parse({ jobName: "my-job-1", baseModelId: "base-model" })).toEqual({
      jobName: "my-job-1",
      baseModelId: "base-model"
    });
  });

  it("rejects invalid step 1 values", () => {
    const result = step1Schema.safeParse({ jobName: "no spaces", baseModelId: "" });
    expect(result.success).toBe(false);
  });

  it("validates step 2 values and epoch guard rails", () => {
    expect(
      step2Schema.parse({
        trainingEpochs: 5,
        evaluationEpochs: 2,
        warmupEpochs: 1,
        learningRate: 0.0001
      })
    ).toEqual({
      trainingEpochs: 5,
      evaluationEpochs: 2,
      warmupEpochs: 1,
      learningRate: 0.0001
    });

    const invalid = step2Schema.safeParse({
      trainingEpochs: 1,
      evaluationEpochs: 2,
      warmupEpochs: 0,
      learningRate: 0.0001
    });

    expect(invalid.success).toBe(false);
  });

  it("accepts empty step 3 review payload", () => {
    expect(step3Schema.parse({})).toEqual({});
  });

  it("validates full fine tune payload", () => {
    const result = fineTuneSchema.parse({
      jobName: "train-job",
      baseModelId: "model-1",
      trainingEpochs: 8,
      evaluationEpochs: 2,
      warmupEpochs: 1,
      learningRate: 0.0001
    });

    expect(result).toEqual({
      jobName: "train-job",
      baseModelId: "model-1",
      trainingEpochs: 8,
      evaluationEpochs: 2,
      warmupEpochs: 1,
      learningRate: 0.0001
    });
  });
});
