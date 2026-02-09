import { NextResponse } from "next/server";

import { fineTuneSchema } from "@/lib/schemas/fineTune";
import { createJob, fetchJobs } from "@/lib/api/server";

export async function GET() {
  try {
    const data = await fetchJobs();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch jobs";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = fineTuneSchema.parse(body);
    const data = await createJob(payload);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : "Unable to create job";
    return NextResponse.json({ message }, { status: 500 });
  }
}
