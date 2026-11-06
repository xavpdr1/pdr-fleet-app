// VIN reading relay for the Scan Remote (public/scan.html).
// Sends a photo to Plate Recognizer's OCR reader (type=vin). Uses PLATE_RECOGNIZER_OCR_TOKEN if set,
// otherwise the plate token PLATE_RECOGNIZER_TOKEN (same account).
const ALLOWED = [/^https:\/\/tangerine-smakager-bdebcf\.netlify\.app$/, /^https:\/\/[a-z0-9-]+--tangerine-smakager-bdebcf\.netlify\.app$/, /^http:\/\/localhost(:\d+)?$/];
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

const MAP = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9, S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9 };
const WT = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
const checkOk = (v) => { if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(v)) return false; let s = 0; for (let i = 0; i < 17; i++) s += (/\d/.test(v[i]) ? +v[i] : MAP[v[i]]) * WT[i]; const r = s % 11; return v[8] === (r === 10 ? "X" : String(r)); };

// Collect every string in the response that contains a 17-character VIN, with any confidence found next to it.
function findVins(node, out, conf) {
  if (node == null) return;
  if (typeof node === "string") {
    const u = node.toUpperCase().replace(/[^A-Z0-9]/g, "");
    for (let i = 0; i + 17 <= u.length; i++) { const w = u.slice(i, i + 17); if (/^[A-HJ-NPR-Z0-9]{17}$/.test(w)) out.push({ vin: w, conf: conf || 0 }); }
    return;
  }
  if (Array.isArray(node)) { node.forEach((n) => findVins(n, out, conf)); return; }
  if (typeof node === "object") {
    const c = typeof node.confidence === "number" ? node.confidence : typeof node.score === "number" ? node.score : conf;
    for (const k of Object.keys(node)) if (k !== "file_url" && k !== "filename") findVins(node[k], out, c);
  }
}

export default async (req) => {
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  const origin = req.headers.get("origin") || "";
  if (origin && !ALLOWED.some((r) => r.test(origin))) return json({ error: "not allowed" }, 403);
  const token = process.env.PLATE_RECOGNIZER_OCR_TOKEN || process.env.PLATE_RECOGNIZER_TOKEN;
  if (!token) return json({ error: "not configured" }, 503);
  let body;
  try { body = await req.json(); } catch { return json({ error: "bad request" }, 400); }
  const m = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(String(body.image || ""));
  if (!m) return json({ error: "no image" }, 400);
  const bytes = Buffer.from(m[2], "base64");
  if (bytes.length > 4.5 * 1024 * 1024) return json({ error: "image too large" }, 413);
  const blob = new Blob([bytes], { type: "image/" + m[1] }), name = "vin." + (m[1] === "jpeg" ? "jpg" : m[1]);
  const form = new FormData();
  form.append("image", blob, name); form.append("upload", blob, name); form.append("type", "vin");
  let r;
  try { r = await fetch("https://api.platerecognizer.com/v1/ocr/reader/", { method: "POST", headers: { Authorization: "Token " + token }, body: form, signal: AbortSignal.timeout(25000) }); }
  catch (e) { return json({ error: e.name === "TimeoutError" ? "timeout" : "service unreachable" }, 504); }
  const text = await r.text(); let d = {}; try { d = JSON.parse(text); } catch {}
  if (r.status === 403 && /credit/i.test(d.detail || "")) return json({ error: "no credits" }, 402);
  if (r.status === 401 || r.status === 403) return json({ error: "token rejected" }, 502);
  if (r.status === 429) return json({ error: "rate limited" }, 429);
  if (!r.ok) return json({ error: "service error " + r.status }, 502);
  const found = []; findVins(d, found, 0);
  found.sort((a, b) => (checkOk(b.vin) - checkOk(a.vin)) || (b.conf - a.conf));
  const best = found[0];
  return json({ ok: true, vin: best ? best.vin : "", valid: best ? checkOk(best.vin) : false, confidence: best ? best.conf : 0 });
};

export const config = { path: "/api/vin" };
