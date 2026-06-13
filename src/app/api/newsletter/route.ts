import type {Locale} from "@/i18n/config";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type NewsletterRequest = {
  firstName?: unknown;
  email?: unknown;
  consent?: unknown;
  website?: unknown;
  locale?: unknown;
};

export async function POST(request: Request) {
  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_NEWSLETTER_URL;
  const secret = process.env.NEWSLETTER_SIGNUP_SECRET;
  const origin = request.headers.get("origin");

  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ok: false}, {status: 403});
  }

  if (!scriptUrl || !secret) {
    console.error("Newsletter integration environment variables are missing.");
    return Response.json({ok: false}, {status: 503});
  }

  let body: NewsletterRequest;

  try {
    body = (await request.json()) as NewsletterRequest;
  } catch {
    return Response.json({ok: false}, {status: 400});
  }

  if (typeof body.website === "string" && body.website.trim()) {
    return Response.json({ok: true});
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const firstName =
    typeof body.firstName === "string" ? body.firstName.trim() : "";
  const locale: Locale = body.locale === "no" ? "no" : "en";

  if (
    !firstName ||
    firstName.length > 80 ||
    !emailPattern.test(email) ||
    body.consent !== true
  ) {
    return Response.json({ok: false}, {status: 400});
  }

  try {
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        firstName,
        email,
        locale,
        consent: true,
        signedUpAt: new Date().toISOString(),
        secret,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    const result = (await response.json()) as {ok?: boolean};

    if (!response.ok || result.ok !== true) {
      throw new Error("Google Apps Script rejected the signup.");
    }

    return Response.json({ok: true});
  } catch (error) {
    console.error("Newsletter signup failed:", error);
    return Response.json({ok: false}, {status: 502});
  }
}
