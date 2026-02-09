import { NextResponse } from "next/server";

import { fetchModels } from "@/lib/api/server";

export async function GET() {
  try {
    const models = await fetchModels();
    return NextResponse.json(models);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch models";
    return NextResponse.json({ message }, { status: 500 });
  }
}
