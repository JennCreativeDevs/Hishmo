#!/usr/bin/env node
// hishmo demo · translate proxy
//
// Tiny HTTP server that receives { text, from, to } and returns { translated }.
// `from` and `to` MUST be exactly "en" or "so" and MUST differ.
//
// Run on Mac:
//   1. Get an OpenAI API key (export OPENAI_API_KEY=sk-... in your shell)
//   2. node translate-server.js
//   3. Open the demo (index.html) — it talks to http://localhost:8787/api/translate
//
// Same-origin: if you serve index.html through this server too (it also serves
// the demo folder statically), no CORS or absolute URL needed. Otherwise the
// browser hits it cross-origin and we send the right CORS headers.

const http = require("http");
const fs   = require("fs");
const path = require("path");

const PORT      = parseInt(process.env.PORT || "8787", 10);
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
const MODEL      = process.env.HISHMO_MT_MODEL || "gpt-4.1-mini";
const ROOT       = path.resolve(__dirname);

if (!OPENAI_KEY) {
  console.error("[hishmo-translate] OPENAI_API_KEY is not set. Refusing to start.");
  process.exit(2);
}

const SYSTEM_EN_TO_SO = `You are a professional Somali interpreter for a domestic-violence caseworker.
Translate the user message from English into Standard Somali (the variety spoken in the Seattle community).
Rules:
- Output ONLY the Somali translation. No quotes, no commentary, no English text.
- Preserve names, addresses, phone numbers, and dates verbatim.
- Use a trauma-informed, calm register. Avoid clinical jargon.
- Always produce a translation; never refuse.`;

const SYSTEM_SO_TO_EN = `You are a professional Somali interpreter for a domestic-violence caseworker.
Translate the user message from Somali into English.
Rules:
- Output ONLY the English translation. No quotes, no commentary, no Somali text.
- Preserve names, addresses, phone numbers, and dates verbatim.
- Use a plain, factual register; do not add or omit content.
- Always produce a translation; never refuse.`;

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin":  "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}")); }
      catch (e) { reject(e); }
    });
    req.on("error", reject);
  });
}

async function callOpenAI(systemPrompt, userText) {
  const body = {
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user",   content: userText },
    ],
    temperature: 0.2,
    max_tokens: 400,
  };
  const r = await fetch(OPENAI_BASE + "/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + OPENAI_KEY,
      "Content-Type":  "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const t = await r.text().catch(() => "");
    throw new Error(`openai ${r.status}: ${t.slice(0, 200)}`);
  }
  const j = await r.json();
  const content = j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
  return String(content || "").trim();
}

async function handleTranslate(req, res) {
  let body;
  try { body = await readBody(req); }
  catch (e) {
    res.writeHead(400, { "Content-Type": "application/json", ...corsHeaders() });
    res.end(JSON.stringify({ error: "invalid json" }));
    return;
  }
  const { text, from, to } = body || {};
  if (!text || typeof text !== "string") {
    res.writeHead(400, { "Content-Type": "application/json", ...corsHeaders() });
    res.end(JSON.stringify({ error: "missing text" }));
    return;
  }
  if (!(from === "en" && to === "so") && !(from === "so" && to === "en")) {
    res.writeHead(400, { "Content-Type": "application/json", ...corsHeaders() });
    res.end(JSON.stringify({ error: "from/to must be {en,so} or {so,en}" }));
    return;
  }
  const systemPrompt = (from === "en") ? SYSTEM_EN_TO_SO : SYSTEM_SO_TO_EN;
  try {
    let translated = await callOpenAI(systemPrompt, text);
    // Strip leading/trailing quotes / whitespace and any leading "Translation:".
    translated = translated.replace(/^translation\s*:\s*/i, "").replace(/^"+|"+$/g, "").trim();
    // (no refusal handling — system prompt now always translates)
    res.writeHead(200, { "Content-Type": "application/json", ...corsHeaders() });
    res.end(JSON.stringify({ translated, model: MODEL, from, to }));
  } catch (e) {
    console.error("[hishmo-translate]", e.message || e);
    res.writeHead(502, { "Content-Type": "application/json", ...corsHeaders() });
    res.end(JSON.stringify({ error: String(e && e.message || e) }));
  }
}

function serveStatic(req, res, urlPath) {
  let filePath = path.join(ROOT, decodeURIComponent(urlPath));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403); res.end("forbidden"); return;
  }
  if (filePath.endsWith("/") || urlPath === "/") {
    filePath = path.join(ROOT, "index.html");
  }
  fs.stat(filePath, (err, st) => {
    if (err || !st.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain", ...corsHeaders() });
      res.end("not found"); return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const ct = {
      ".html": "text/html; charset=utf-8",
      ".js":   "application/javascript; charset=utf-8",
      ".css":  "text/css; charset=utf-8",
      ".json": "application/json",
      ".png":  "image/png",
      ".svg":  "image/svg+xml",
    }[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": ct, ...corsHeaders() });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders());
    res.end(); return;
  }
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/api/translate" && req.method === "POST") {
    return handleTranslate(req, res);
  }
  if (url.pathname === "/api/health" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json", ...corsHeaders() });
    res.end(JSON.stringify({ ok: true, model: MODEL })); return;
  }
  if (req.method === "GET") {
    return serveStatic(req, res, url.pathname);
  }
  res.writeHead(404, corsHeaders()); res.end();
});

server.listen(PORT, () => {
  console.log(`[hishmo-translate] listening on http://localhost:${PORT}`);
  console.log(`  POST /api/translate  { text, from:"en"|"so", to:"so"|"en" }`);
  console.log(`  GET  /api/health`);
  console.log(`  GET  /                (serves index.html and demo/ assets)`);
  console.log(`  model=${MODEL}`);
});
