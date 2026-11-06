// Team password gate for the whole site.
// Every page and the /api relays need the team password, except the public
// customer page (Colibri at Your Shop), the files it loads, and /downloads
// (the Colibri unit installers and the scan remote's self-update fetch these
// without a browser, so they must stay reachable).
//
// The password lives in the Netlify environment variable SITE_PASSWORD.
// Changing it signs everyone out. Until it is set, the gate lets everything through.

const COOKIE = "pdr_auth";
const MAX_AGE = 60 * 60 * 24 * 180; // stay signed in on a phone for 180 days

const PUBLIC = [
  /^\/shop-preview(\.html)?$/,
  /^\/colibri-logo\.jpg$/,
  /^\/colibri(-xl)?\.glb$/,
  /^\/favicon-32\.png$/,
  /^\/apple-touch-icon\.png$/,
  /^\/icon-\d+\.png$/,
  /^\/manifest\.webmanifest$/,
  /^\/robots\.txt$/,
  /^\/downloads\//,
  /^\/colibri-checkin\.ps1$/,
];

const enc = new TextEncoder();
async function tokenFor(password) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode("pdr-team-site-v1"));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function same(a, b) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
function readCookie(req, name) {
  const m = (req.headers.get("cookie") || "").match(new RegExp("(?:^|;\\s*)" + name + "=([^;]+)"));
  return m ? m[1] : "";
}
function safeNext(n) {
  return n && n.startsWith("/") && !n.startsWith("//") && !n.startsWith("/__") ? n : "/links.html";
}
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function loginPage(next, wrong) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">
<title>Sign in · PDR-Team</title><link rel="icon" href="/favicon-32.png">
<style>
:root{--bg:#F2F4F8;--surface:#fff;--line:#d9dfe5;--fg:#1A2332;--muted:#5b6876;--accent:#1F4E79;--bad:#c0392b}
@media (prefers-color-scheme:dark){:root{--bg:#12171c;--surface:#1a2128;--line:#2c3640;--fg:#e7ecf1;--muted:#97a4b1;--accent:#6FA8DC;--bad:#ff7b6b}}
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--bg);color:var(--fg);font:16px/1.45 system-ui,sans-serif;padding:16px}
form{width:100%;max-width:360px;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:24px;display:grid;gap:14px}
img{width:120px;justify-self:center}h1{margin:0;font-size:22px;text-align:center}p{margin:0;color:var(--muted);text-align:center;font-size:14px}
input{width:100%;font:inherit;padding:12px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--fg)}
button{font:600 16px system-ui,sans-serif;padding:12px;border:0;border-radius:8px;background:var(--accent);color:#fff;cursor:pointer}
.bad{color:var(--bad);font-weight:600}
</style></head><body>
<form method="post" action="/__login">
<img src="/apple-touch-icon.png" alt="">
<h1>PDR-Team</h1><p>Enter the team password to continue.</p>
${wrong ? '<p class="bad">Wrong password. Try again.</p>' : ""}
<input type="password" name="password" autocomplete="current-password" placeholder="Team password" required autofocus>
<input type="hidden" name="next" value="${esc(next)}">
<button type="submit">Sign in</button>
</form></body></html>`;
  return new Response(html, { status: wrong ? 401 : 200, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
}

export default async (req, context) => {
  const url = new URL(req.url);
  const path = url.pathname;
  const password = Netlify.env.get("SITE_PASSWORD");
  if (!password) { // not set up yet: behave like before
    const res = await context.next();
    res.headers.set("x-pdr-gate", "off");
    return res;
  }

  if (path === "/__logout") {
    return new Response(null, { status: 303, headers: { location: "/__login", "set-cookie": `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax` } });
  }

  if (path === "/__login") {
    if (req.method === "POST") {
      const form = await req.formData();
      const next = safeNext(String(form.get("next") || ""));
      const given = String(form.get("password") || "");
      const [a, b] = await Promise.all([tokenFor(given), tokenFor(password)]);
      if (!same(a, b)) {
        await new Promise((r) => setTimeout(r, 800)); // slow down guessing
        return loginPage(next, true);
      }
      return new Response(null, { status: 303, headers: { location: next, "cache-control": "no-store", "set-cookie": `${COOKIE}=${b}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax` } });
    }
    return loginPage(safeNext(url.searchParams.get("next") || ""), false);
  }

  if (PUBLIC.some((r) => r.test(path))) {
    const res = await context.next();
    res.headers.set("x-pdr-gate", "public");
    return res;
  }

  const have = readCookie(req, COOKIE);
  if (have && same(have, await tokenFor(password))) {
    const res = await context.next();
    res.headers.set("cache-control", "private, no-store");
    return res;
  }

  if (path.startsWith("/api/")) {
    return new Response(JSON.stringify({ error: "sign in required" }), { status: 401, headers: { "content-type": "application/json" } });
  }
  return new Response(null, { status: 302, headers: { location: "/__login?next=" + encodeURIComponent(path + url.search), "cache-control": "no-store" } });
};

export const config = { path: "/*" };
