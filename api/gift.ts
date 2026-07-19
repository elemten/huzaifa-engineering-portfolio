export const config = { runtime: "edge" };

const ALLOWED_ORIGINS = new Set([
  "https://huzaifa.cc",
  "https://www.huzaifa.cc",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 10;
const MAX_BODY_BYTES = 1_024;

type RateWindow = { count: number; resetAt: number };
const rateWindows = new Map<string, RateWindow>();

function sanitizeName(raw: string) {
  return (raw || "").trim().slice(0, 40).replace(/[^a-zA-Z0-9 _'-]/g, "");
}

function formatName(raw: string) {
  return raw
    .split(/\s+/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function pickTwoLinePoem(raw: string, name: string) {
  const looksComplete = (line: string) => /[.!?]$/.test(line.trim());
  const hasName = (line: string) => line.toLowerCase().includes(name.toLowerCase());
  const lines = (raw || "")
    .split(/\r?\n/)
    .map(line => line.trim().replace(/^\d+[\).:\s-]*/, ""))
    .filter(Boolean);

  if (
    lines.length === 2 &&
    lines.every(line => looksComplete(line) && line.length >= 8 && hasName(line))
  ) {
    return `${lines[0]}\n${lines[1]}`;
  }

  return "";
}

function requestOrigin(req: Request) {
  return req.headers.get("origin") || "";
}

function isAllowedOrigin(origin: string) {
  return !origin || ALLOWED_ORIGINS.has(origin);
}

function responseHeaders(req: Request, extra: Record<string, string> = {}) {
  const origin = requestOrigin(req);
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin)
      ? origin
      : "https://huzaifa.cc",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
    ...extra,
  };
}

function json(req: Request, status: number, body: Record<string, unknown>, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: responseHeaders(req, extra),
  });
}

function clientKey(req: Request) {
  return (
    req.headers.get("x-vercel-forwarded-for") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "anonymous"
  );
}

function rateLimitExceeded(req: Request) {
  const now = Date.now();
  const key = clientKey(req);
  const current = rateWindows.get(key);

  if (!current || current.resetAt <= now) {
    rateWindows.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > MAX_REQUESTS_PER_WINDOW;
}

export default async function handler(req: Request) {
  if (!isAllowedOrigin(requestOrigin(req))) {
    return json(req, 403, { error: "Origin not allowed" });
  }

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: responseHeaders(req) });
  }

  if (req.method !== "POST") {
    return json(req, 405, { error: "Method not allowed" });
  }

  const declaredLength = Number(req.headers.get("content-length") || 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return json(req, 413, { error: "Request too large" });
  }

  if (rateLimitExceeded(req)) {
    return json(req, 429, { error: "Please wait before trying again" }, { "Retry-After": "60" });
  }

  const startedAt = performance.now();
  const requestId = crypto.randomUUID();

  try {
    const body = (await req.json().catch(() => ({}))) as { name?: unknown };
    const nameRaw = typeof body.name === "string" ? body.name : "";
    const name = formatName(sanitizeName(nameRaw));

    if (!name) return json(req, 400, { error: "Name is required" });

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return json(req, 503, { error: "Gift service unavailable" });

    const buildPrompt = (attempt: number) =>
      attempt === 0
        ? `Write a short, witty 2-line poem using the name "${name}". Each line must be a complete sentence ending with punctuation. Include the name naturally in both lines. Return exactly two lines with no title, quotes, explanation, or markdown.`
        : `Write exactly two witty lines using "${name}" in both. Use 6-12 words per line and end each line with punctuation. Return only the two lines.`;

    let poem = "";
    let connectedAt = performance.now();

    for (let attempt = 0; attempt < 2; attempt += 1) {
      const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: "Follow the output format exactly." },
            { role: "user", content: buildPrompt(attempt) },
          ],
          temperature: attempt === 0 ? 0.6 : 0.8,
          max_tokens: 100,
        }),
      });

      connectedAt = performance.now();
      if (!upstream.ok) {
        if (attempt === 0 && (upstream.status === 429 || upstream.status >= 500)) continue;
        return json(req, 502, { error: "Gift service temporarily unavailable", requestId });
      }

      const data = (await upstream.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      poem = pickTwoLinePoem(data.choices?.[0]?.message?.content?.trim() || "", name);
      if (poem) break;
    }

    if (!poem) {
      return json(req, 502, { error: "Could not create a valid two-line gift", requestId });
    }

    const edgeMs = Math.round(performance.now() - startedAt);
    const connectMs = Math.round(connectedAt - startedAt);
    return json(
      req,
      200,
      { pun: poem, name, requestId, timing: { edgeMs, apiConnectMs: connectMs } },
      {
        "Cache-Control": "no-store",
        "X-Request-Id": requestId,
        "X-Edge-Time-Ms": String(edgeMs),
      }
    );
  } catch (error: unknown) {
    console.error("Gift API error", error instanceof Error ? error.name : "UnknownError");
    return json(req, 500, { error: "Server error", requestId });
  }
}
