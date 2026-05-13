// Server-side helper — calls the Apps Script webhook
// Never import this from client components

const WEBHOOK_URL    = process.env.WEBHOOK_URL    || "";
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "";
const DEBUG          = process.env.WEBHOOK_DEBUG  === "true";

interface WebhookPostBody {
  type: string;
  token: string;
  [key: string]: unknown;
}

// ─────────────────────────────────────────────────────────────
//  Apps Script POST fix:
//  Google redirects POST /exec → 302 → new URL.
//  Node fetch follows 302 as GET (HTTP spec), so doPost never fires.
//  Fix: use redirect:"manual", grab Location header, re-POST there.
// ─────────────────────────────────────────────────────────────
async function appsScriptPost(url: string, payload: object): Promise<string> {
  const bodyStr = JSON.stringify(payload);
  const headers = { "Content-Type": "application/json" };
  const signal  = AbortSignal.timeout(25_000);

  // Step 1 — hit the /exec URL, don't follow redirect
  const first = await fetch(url, {
    method: "POST",
    headers,
    body: bodyStr,
    redirect: "manual",
    signal,
  });

  if (DEBUG) console.log("[webhook] step1 status:", first.status);

  // Step 2 — if redirected, re-POST to the Location URL
  if (first.status === 301 || first.status === 302 || first.status === 307 || first.status === 308) {
    const location = first.headers.get("location");
    if (!location) throw new Error("Redirect with no Location header");
    if (DEBUG) console.log("[webhook] following redirect to:", location);

    const second = await fetch(location, {
      method: "POST",
      headers,
      body: bodyStr,
      redirect: "follow",
      signal: AbortSignal.timeout(25_000),
    });

    return second.text();
  }

  // No redirect — read body directly
  return first.text();
}

export async function webhookPost(body: Omit<WebhookPostBody, "token"> & { type: string }) {
  if (!WEBHOOK_URL) {
    return { success: false, error: "WEBHOOK_URL not set in .env.local" };
  }

  const payload: WebhookPostBody = { ...body, token: WEBHOOK_SECRET };
  if (DEBUG) console.log("[webhook] POST →", body.type, JSON.stringify(payload));

  try {
    const text = await appsScriptPost(WEBHOOK_URL, payload);
    if (DEBUG) console.log("[webhook] response:", text);

    try {
      return JSON.parse(text);
    } catch {
      return { success: false, error: "Invalid JSON from Apps Script", raw: text };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[webhook] POST error:", msg);
    return { success: false, error: msg };
  }
}

export async function webhookGet(params: Record<string, string>) {
  if (!WEBHOOK_URL) {
    return { success: false, error: "WEBHOOK_URL not set in .env.local" };
  }

  const qs  = new URLSearchParams({ ...params, token: WEBHOOK_SECRET }).toString();
  const url = `${WEBHOOK_URL}?${qs}`;
  if (DEBUG) console.log("[webhook] GET →", url);

  try {
    const res  = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(25_000),
    });
    const text = await res.text();
    if (DEBUG) console.log("[webhook] response:", text);

    try {
      return JSON.parse(text);
    } catch {
      return { success: false, error: "Invalid JSON from Apps Script", raw: text };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[webhook] GET error:", msg);
    return { success: false, error: msg };
  }
}
