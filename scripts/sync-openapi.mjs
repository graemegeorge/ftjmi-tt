import { writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";

const OPENAPI_URL = "https://fe-test-api-production-cb39.up.railway.app/api/openapi.json";
const OUTPUT_PATH = "src/lib/api/generated/openapi.json";

async function syncOpenApi() {
  const apiKey = process.env.OPENAPI_API_KEY || process.env.FINE_TUNE_API_KEY;
  const headers = apiKey ? { "x-api-key": apiKey } : undefined;
  let payload;

  try {
    const response = await fetch(OPENAPI_URL, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch OpenAPI spec: HTTP ${response.status}`);
    }
    payload = await response.json();
  } catch {
    payload = await syncViaCurl(apiKey);
  }

  await writeFile(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  process.stdout.write(`Synced OpenAPI spec to ${OUTPUT_PATH}\n`);
}

function syncViaCurl(apiKey) {
  const args = ["-sS", OPENAPI_URL];
  if (apiKey) {
    args.unshift("-H", `x-api-key: ${apiKey}`);
  }

  return new Promise((resolve, reject) => {
    const curl = spawn("curl", args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";

    curl.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });
    curl.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });

    curl.on("error", (error) => reject(error));
    curl.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr.trim() || `curl exited with code ${code}`));
        return;
      }

      try {
        resolve(JSON.parse(stdout));
      } catch {
        reject(new Error("Failed to parse OpenAPI JSON from curl output"));
      }
    });
  });
}

syncOpenApi().catch((error) => {
  const message = error instanceof Error ? error.message : "Unknown sync error";
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
