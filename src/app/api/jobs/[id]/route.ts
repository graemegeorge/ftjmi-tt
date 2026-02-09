import { NextResponse } from "next/server";

import { deleteJob, ExternalApiError } from "@/lib/api/server";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ message: "Job id is required" }, { status: 400 });
  }

  try {
    const data = await deleteJob(id);
    return data ? NextResponse.json(data) : new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof ExternalApiError) {
      return NextResponse.json(error.payload, { status: error.status });
    }

    const message = error instanceof Error ? error.message : "Unable to delete job";
    return NextResponse.json({ message }, { status: 500 });
  }
}
