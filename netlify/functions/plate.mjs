// Plate reading relay for the Scan Remote (public/scan.html).
// The phone sends a photo here; this forwards it to Plate Recognizer with the
// account token kept in the Netlify environment variable PLATE_RECOGNIZER_TOKEN.
const ALLOWED = [/^https:\/\/tangerine-smakager-bdebcf\.netlify\.app$/, /^https:\/\/[a-z0-9-]+--tangerine-smakager-bdebcf\.netlify\.app$/, /^http:\/\/localhost(:\d+)?$/];
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

export default async (req) => {
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  const origin = req.headers.get("origin") || "";
  if (origin && !ALLOWED.some((r) => r.test(origin))) return json({ error: "not allowed" }, 403);
  const token = process.env.PLATE_RECOGNIZER_TOKEN;
  if (!token) return json({ error: "not configured" }, 503);

  let body;
  try { body = await req.json(); } catch { return json({ error: "bad request" }, 400); }
  const m = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(String(body.image || ""));
  if (!m) return json({ error: "no image" }, 400);
  const bytes = Buffer.from(m[2], "base64");
  if (bytes.length > 4.5 * 1024 * 1024) return json({ error: "image too large" }, 413);

  const form = new FormData();
  form.append("upload", new Blob([bytes], { type: "image/" + m[1] }), "plate." + (m[1] === "jpeg" ? "jpg" : m[1]));
  form.append("regions", "us");
  let r;
  try {
    r = await fetch("https://api.platerecognizer.com/v1/plate-reader/", { method: "POST", headers: { Authorization: "Token " + token }, body: form, signal: AbortSignal.timeout(15000) });
  } catch (e) { return json({ error: "service unreachable" }, 502); }
  if (r.status === 403 || r.status === 401) return json({ error: "token rejected" }, 502);
  if (r.status === 429) return json({ error: "rate limited" }, 429);
  if (!r.ok) return json({ error: "service error " + r.status }, 502);
  const d = await r.json();
  const results = (d.results || []).sort((a, b) => (b.score || 0) - (a.score || 0));
  if (!results.length) return json({ ok: true, plate: "" });
  const best = results[0];
  const code = (best.region && best.region.code) || "";
  return json({
    ok: true,
    plate: String(best.plate || "").toUpperCase(),
    score: best.score || 0,
    state: /^us-[a-z]{2}$/.test(code) ? code.slice(3).toUpperCase() : "",
    alternates: (best.candidates || []).map((c) => String(c.plate || "").toUpperCase()).filter((p) => p && p !== String(best.plate || "").toUpperCase()).slice(0, 3),
  });
};

export const config = { path: "/api/plate" };
