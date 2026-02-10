import { NextResponse } from "next/server";

import { ExternalApiError, fetchModels } from "@/lib/api/server";

export async function GET() {
  try {
    const models = await fetchModels();
    return NextResponse.json(models);
  } catch (error) {
    if (error instanceof ExternalApiError) {
      return NextResponse.json(error.payload, { status: error.status });
    }

    const message = error instanceof Error ? error.message : "Unable to fetch models";
    return NextResponse.json({ message }, { status: 500 });
  }
}
