'use strict';
require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { promisify } = require('util');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const scrypt = promisify(crypto.scrypt);
const COOKIE_NAME = 'sonora_session';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_ACTIVE_JOBS = 2;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const sessions = new Map();
const jobs = new Map();
const generationWindows = new Map();
const authWindows = new Map();
const catalogWindows = new Map();
let activeJobs = 0;
let users = readUsers();

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(express.json({ limit: '20kb' }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});
app.use(express.static(PUBLIC_DIR, { dotfiles: 'deny', index: 'index.html', maxAge: process.env.NODE_ENV === 'production' ? '1h' : 0 }));

function readUsers() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const parsed = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) { return []; }
}
async function saveUsers() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const temp = `${USERS_FILE}.${process.pid}.tmp`;
  await fs.promises.writeFile(temp, JSON.stringify(users, null, 2), { mode: 0o600 });
  await fs.promises.rename(temp, USERS_FILE);
}
function publicUser(user) { return user ? { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt } : null; }
function cookieValue(req, name) {
  const header = req.headers.cookie || '';
  for (const part of header.split(';')) {
    const at = part.indexOf('=');
    if (at < 0) continue;
    if (part.slice(0, at).trim() === name) { try { return decodeURIComponent(part.slice(at + 1).trim()); } catch (_) { return ''; } }
  }
  return '';
}
function requestUser(req) {
  const token = cookieValue(req, COOKIE_NAME);
  if (!token) return null;
  const session = sessions.get(token);
  if (!session || session.expiresAt < Date.now()) { sessions.delete(token); return null; }
  return users.find(u => u.id === session.userId) || null;
}
function startSession(res, user) {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, { userId: user.id, expiresAt: Date.now() + SESSION_TTL_MS });
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}${secure}`);
}
function clearSession(req, res) {
  const token = cookieValue(req, COOKIE_NAME);
  if (token) sessions.delete(token);
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`);
}
function rateLimit(map, key, max, windowMs = RATE_LIMIT_WINDOW_MS) {
  const now = Date.now();
  let item = map.get(key);
  if (!item || now - item.start >= windowMs) { item = { start: now, count: 0 }; map.set(key, item); }
  if (item.count >= max) return false;
  item.count += 1;
  return true;
}
function safeEmail(value) { return typeof value === 'string' ? value.trim().toLowerCase().slice(0, 254) : ''; }
function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function safeName(value) { return typeof value === 'string' ? value.trim().replace(/[<>]/g, '').slice(0, 60) : ''; }
function safeMessage(statusCode, providerMessage) {
  if (statusCode === 401 || statusCode === 403) return 'MiniMax rejected the API credentials or this account does not have permission for Music Generation. Confirm that this is a standard API key and that Music Generation access is enabled.';
  if (statusCode === 429) return 'MiniMax rate limit or usage quota reached. Check your account usage and try later.';
  if (statusCode === 402) return 'MiniMax requires available credits or an eligible plan for this API.';
  if (providerMessage && /model|parameter|prompt|lyrics|access|quota|credit|permission|unsupported|invalid/i.test(providerMessage)) return String(providerMessage).slice(0, 240);
  return `MiniMax returned an error (HTTP ${statusCode}). Check the service logs and your API account access.`;
}
function pruneMaps() {
  const now = Date.now();
  for (const [id, job] of jobs) if (now - job.createdAt > 2 * 60 * 60 * 1000) jobs.delete(id);
  for (const map of [sessions, generationWindows, authWindows, catalogWindows]) {
    for (const [key, entry] of map) {
      const expires = entry.expiresAt || (entry.start ? entry.start + 2 * RATE_LIMIT_WINDOW_MS : 0);
      if (expires && expires < now) map.delete(key);
    }
  }
}
function withPreviewProxy(url) {
  return `/api/catalog/audio?url=${encodeURIComponent(url)}`;
}
function allowedPreviewUrl(raw) {
  try {
    const u = new URL(raw);
    if (u.protocol !== 'https:') return false;
    const h = u.hostname.toLowerCase();
    return h === 'audio-ssl.itunes.apple.com' || h === 'audio.itunes.apple.com' || h === 'aod.itunes.apple.com' || h === 'dzcdn.net' || h.endsWith('.dzcdn.net');
  } catch (_) { return false; }
}
function normalizeAppleTrack(t) {
  if (!t || !t.trackId || !t.trackName || !t.previewUrl || !allowedPreviewUrl(t.previewUrl)) return null;
  const art = String(t.artworkUrl100 || t.artworkUrl60 || '').replace(/\d+x\d+bb\./, '600x600bb.');
  return {
    id: `apple-${t.trackId}`,
    source: 'Apple Music preview',
    title: String(t.trackName).slice(0, 180),
    artist: { name: String(t.artistName || 'Unknown artist').slice(0, 120) },
    album: { title: String(t.collectionName || 'Single').slice(0, 160), cover_small: t.artworkUrl60 || art, cover_medium: art || t.artworkUrl100 || '', cover: art || t.artworkUrl100 || '' },
    preview: withPreviewProxy(t.previewUrl),
    duration: t.trackTimeMillis ? Math.round(t.trackTimeMillis / 1000) : 30,
    genre: t.primaryGenreName || 'Global',
    releaseDate: t.releaseDate || null
  };
}
function normalizeDeezerTrack(t) {
  if (!t || !t.id || !t.title || !t.preview || !allowedPreviewUrl(t.preview)) return null;
  return {
    id: `deezer-${t.id}`,
    source: 'Deezer preview',
    title: String(t.title).replace(/<[^>]*>/g, '').slice(0, 180),
    artist: { name: String(t.artist?.name || 'Unknown artist').slice(0, 120) },
    album: { title: String(t.album?.title || 'Single').slice(0, 160), cover_small: t.album?.cover_small || '', cover_medium: t.album?.cover_medium || '', cover: t.album?.cover_big || t.album?.cover_medium || '' },
    preview: withPreviewProxy(t.preview),
    duration: Number(t.duration) || 30,
    genre: 'Global',
    releaseDate: null
  };
}
async function fetchJson(url, timeoutMs = 12000) {
  const response = await fetch(url, { headers: { 'User-Agent': 'SONORA-Music-Prototype/1.0' }, signal: AbortSignal.timeout(timeoutMs) });
  if (!response.ok) throw new Error(`Catalog provider HTTP ${response.status}`);
  return response.json();
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'SONORA Worldwide Music', configured: Boolean(process.env.MINIMAX_API_KEY), catalog: 'Apple Search + Deezer previews', auth: 'prototype email/password account system' });
});

// Basic prototype authentication: passwords are salted + hashed and sessions are HttpOnly.
// A production deployment should use a durable database and email verification / recovery.
app.get('/api/auth/me', (req, res) => {
  const user = requestUser(req);
  res.json({ authenticated: Boolean(user), user: publicUser(user) });
});
app.post('/api/auth/register', async (req, res) => {
  pruneMaps();
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (!rateLimit(authWindows, `register:${ip}`, 8)) return res.status(429).json({ error: 'Too many account attempts. Please wait and try again.' });
  const name = safeName(req.body?.name);
  const email = safeEmail(req.body?.email);
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (name.length < 2) return res.status(400).json({ error: 'Enter your name (at least 2 characters).' });
  if (!isValidEmail(email)) return res.status(400).json({ error: 'Enter a valid email address.' });
  if (password.length < 8 || password.length > 128) return res.status(400).json({ error: 'Your password must be 8–128 characters long.' });
  if (users.some(u => u.email === email)) return res.status(409).json({ error: 'An account with this email already exists. Sign in instead.' });
  try {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = (await scrypt(password, salt, 64)).toString('hex');
    const user = { id: crypto.randomUUID(), name, email, salt, hash, createdAt: new Date().toISOString() };
    users.push(user);
    await saveUsers();
    startSession(res, user);
    res.status(201).json({ ok: true, user: publicUser(user) });
  } catch (err) { console.error('[auth] register failed', err?.message || err); res.status(500).json({ error: 'Could not create account. Please try again.' }); }
});
app.post('/api/auth/login', async (req, res) => {
  pruneMaps();
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (!rateLimit(authWindows, `login:${ip}`, 12)) return res.status(429).json({ error: 'Too many sign-in attempts. Please wait and try again.' });
  const email = safeEmail(req.body?.email);
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const user = users.find(u => u.email === email);
  if (!user || password.length > 128) return res.status(401).json({ error: 'Email or password is incorrect.' });
  try {
    const hash = await scrypt(password, user.salt, 64);
    const expected = Buffer.from(user.hash, 'hex');
    if (expected.length !== hash.length || !crypto.timingSafeEqual(expected, hash)) return res.status(401).json({ error: 'Email or password is incorrect.' });
    startSession(res, user);
    res.json({ ok: true, user: publicUser(user) });
  } catch (err) { console.error('[auth] login failed', err?.message || err); res.status(500).json({ error: 'Could not sign in. Please try again.' }); }
});
app.post('/api/auth/logout', (req, res) => { clearSession(req, res); res.json({ ok: true }); });

// Worldwide catalog search; playback remains in SONORA using a same-origin audio proxy.
app.get('/api/catalog/search', async (req, res) => {
  pruneMaps();
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (!rateLimit(catalogWindows, ip, 35)) return res.status(429).json({ error: 'You have searched many times in a short period. Wait a moment and try again.' });
  const query = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 120) : '';
  if (query.length < 2) return res.status(400).json({ error: 'Enter at least two characters to search.' });
  const term = encodeURIComponent(query);
  const appleUrl = country => `https://itunes.apple.com/search?term=${term}&entity=song&limit=40&country=${country}&media=music`;
  const tasks = await Promise.allSettled([
    fetchJson(appleUrl('IN')).then(j => (j.results || []).map(normalizeAppleTrack).filter(Boolean)),
    fetchJson(`https://api.deezer.com/search?q=${term}&limit=40`).then(j => (j.data || []).map(normalizeDeezerTrack).filter(Boolean))
  ]);
  let results = [];
  for (const task of tasks) if (task.status === 'fulfilled') results.push(...task.value);
  // Broaden searches where the Indian store has no previews/results.
  if (!results.length) {
    try { const j = await fetchJson(appleUrl('US')); results.push(...(j.results || []).map(normalizeAppleTrack).filter(Boolean)); } catch (_) {}
  }
  if (!results.length) {
    const errors = tasks.filter(t => t.status === 'rejected').length;
    console.warn(`[catalog] search had no playable results for query=${JSON.stringify(query)}; provider failures=${errors}`);
    return res.json({ ok: true, query, data: [], message: 'No playable previews were returned for this query. Try the movie title, song title, or artist name.' });
  }
  const seen = new Set();
  results = results.filter(t => {
    const key = `${t.title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '')}|${t.artist.name.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '')}`;
    if (seen.has(key)) return false;
    seen.add(key); return true;
  }).slice(0, 60);
  res.setHeader('Cache-Control', 'private, max-age=45');
  res.json({ ok: true, query, providers: [...new Set(results.map(t => t.source))], data: results });
});
app.get('/api/catalog/audio', async (req, res) => {
  const upstreamUrl = typeof req.query.url === 'string' ? req.query.url : '';
  if (!allowedPreviewUrl(upstreamUrl)) return res.status(400).json({ error: 'This audio preview host is not allowed.' });
  try {
    const audioHost = new URL(upstreamUrl).hostname.toLowerCase();
    const referer = audioHost.endsWith('.dzcdn.net') || audioHost === 'dzcdn.net' ? 'https://www.deezer.com/' : 'https://music.apple.com/';
    const upstream = await fetch(upstreamUrl, { headers: { 'User-Agent': 'SONORA-Music-Prototype/1.0', 'Referer': referer }, signal: AbortSignal.timeout(15000) });
    if (!upstream.ok) return res.status(502).json({ error: `Audio provider returned HTTP ${upstream.status}.` });
    const audio = Buffer.from(await upstream.arrayBuffer());
    if (!audio.length || audio.length > 12 * 1024 * 1024) return res.status(502).json({ error: 'The preview audio was empty or too large.' });
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'audio/mpeg');
    res.setHeader('Content-Length', String(audio.length));
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Accept-Ranges', 'bytes');
    const range = req.headers.range;
    if (range && /^bytes=\d*-\d*$/.test(range)) {
      const [, startRaw, endRaw] = range.match(/^bytes=(\d*)-(\d*)$/) || [];
      let start = startRaw ? Number(startRaw) : Math.max(0, audio.length - Number(endRaw || 0));
      let end = endRaw && startRaw ? Number(endRaw) : audio.length - 1;
      start = Math.max(0, start); end = Math.min(audio.length - 1, end);
      if (start <= end && start < audio.length) {
        const chunk = audio.subarray(start, end + 1);
        res.status(206).setHeader('Content-Range', `bytes ${start}-${end}/${audio.length}`);
        res.setHeader('Content-Length', String(chunk.length)); return res.end(chunk);
      }
    }
    res.end(audio);
  } catch (err) { console.warn('[catalog] audio proxy failed:', err?.message || err); res.status(502).json({ error: 'Could not load this preview. Try another result.' }); }
});

app.post('/api/music/generate', (req, res) => {
  pruneMaps();
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'MiniMax is not configured on the server. Add MINIMAX_API_KEY to the server environment, then restart or redeploy.' });
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (!rateLimit(generationWindows, ip, 4)) return res.status(429).json({ error: 'Generation limit reached for this IP. Please wait a few minutes before trying again.' });
  if (activeJobs >= MAX_ACTIVE_JOBS) return res.status(429).json({ error: 'SONORA is already generating two songs. Wait for one to finish, then try again.' });

  const body = req.body || {};
  const title = typeof body.title === 'string' ? body.title.trim().slice(0, 80) : 'Untitled song';
  const prompt = typeof body.prompt === 'string' ? body.prompt.trim().slice(0, 1200) : '';
  const genre = typeof body.genre === 'string' ? body.genre.trim().slice(0, 80) : 'Pop';
  const mood = typeof body.mood === 'string' ? body.mood.trim().slice(0, 60) : 'Dreamy';
  const language = typeof body.language === 'string' ? body.language.trim().slice(0, 60) : 'Instrumental';
  const instrumental = body.instrumental === true || language.toLowerCase() === 'instrumental';
  const lyrics = typeof body.lyrics === 'string' ? body.lyrics.trim().slice(0, 3500) : '';
  if (!prompt) return res.status(400).json({ error: 'Describe your song before generating it.' });
  if (!instrumental && lyrics.length > 3500) return res.status(400).json({ error: 'Lyrics must be 3500 characters or fewer.' });

  const jobId = crypto.randomUUID();
  jobs.set(jobId, { id: jobId, status: 'processing', createdAt: Date.now(), updatedAt: Date.now(), audioBuffer: null });
  activeJobs += 1;
  res.status(202).json({ ok: true, jobId, status: 'processing' });
  setImmediate(() => runGeneration(jobId, { title, prompt, genre, mood, language, instrumental, lyrics }));
});

async function runGeneration(jobId, input) {
  const job = jobs.get(jobId);
  if (!job) { activeJobs = Math.max(0, activeJobs - 1); return; }
  try {
    const apiKey = process.env.MINIMAX_API_KEY;
    const model = process.env.MINIMAX_MUSIC_MODEL || 'music-3.0';
    const url = process.env.MINIMAX_MUSIC_ENDPOINT || 'https://api.minimax.io/v1/music_generation';
    const promptParts = [
      `Song title: ${input.title}.`, `Genre: ${input.genre}.`, `Mood: ${input.mood}.`,
      input.instrumental ? 'Instrumental only, no vocals or lyrics.' : `Create an original song in ${input.language}. Do not imitate an existing recording or artist.`,
      `Creative direction: ${input.prompt}`,
      'Use a deliberate intro, memorable hook, evolving arrangement, clear instrument separation, balanced low end, controlled dynamics and polished studio production.'
    ];
    const requestBody = { model, prompt: promptParts.join(' ').slice(0, 1900), audio_setting: { sample_rate: 44100, bitrate: 256000, format: 'mp3' }, output_format: 'url' };
    if (input.instrumental) requestBody.is_instrumental = true;
    else if (input.lyrics) requestBody.lyrics = input.lyrics;
    else requestBody.lyrics_optimizer = true;

    const response = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody), signal: AbortSignal.timeout(180000) });
    const data = await response.json().catch(() => ({}));
    const providerStatus = Number(data?.base_resp?.status_code ?? 0);
    const providerMessage = data?.base_resp?.status_msg || data?.message || '';
    if (!response.ok || providerStatus !== 0) {
      const error = safeMessage(response.status || 502, providerMessage);
      job.status = 'failed'; job.error = error; job.updatedAt = Date.now();
      console.error(`[MiniMax] job ${jobId} failed: HTTP ${response.status}; provider status ${providerStatus}; ${String(providerMessage).slice(0, 180)}`);
      return;
    }
    const audioValue = data?.data?.audio || data?.audio_url || data?.audioUrl;
    let audioBuffer = null;
    if (typeof audioValue === 'string' && /^https:\/\//i.test(audioValue)) {
      // MiniMax's URL output expires after 24h; download it now and serve it at a same-origin SONORA URL.
      const audioResponse = await fetch(audioValue, { signal: AbortSignal.timeout(60000) });
      if (!audioResponse.ok) throw new Error(`Could not download generated audio (HTTP ${audioResponse.status}).`);
      const arr = await audioResponse.arrayBuffer();
      if (!arr.byteLength || arr.byteLength > 48 * 1024 * 1024) throw new Error('Generated audio was empty or exceeded SONORA’s 48 MB prototype limit.');
      audioBuffer = Buffer.from(arr);
    } else if (typeof audioValue === 'string' && /^[0-9a-f]+$/i.test(audioValue) && audioValue.length > 500) {
      audioBuffer = Buffer.from(audioValue, 'hex');
    } else if (typeof audioValue === 'string' && audioValue.length > 500) {
      try { audioBuffer = Buffer.from(audioValue, 'base64'); } catch (_) {}
    }
    if (!audioBuffer || !audioBuffer.length) {
      job.status = 'failed'; job.error = 'MiniMax responded without usable audio. Confirm your account access and that output_format=url is supported by your selected model.'; job.updatedAt = Date.now();
      console.error(`[MiniMax] job ${jobId}: no usable audio returned; response keys=${Object.keys(data || {}).join(',')}`); return;
    }
    job.audioBuffer = audioBuffer;
    const extra = data?.extra_info || {};
    let duration = Number(extra.music_duration || extra.duration || 0) || null;
    if (duration && duration > 10000) duration = Math.round(duration / 1000);
    job.status = 'complete';
    job.song = { audioUrl: `/api/music/jobs/${jobId}/audio`, duration, model, format: 'mp3' };
    job.updatedAt = Date.now();
    console.log(`[MiniMax] job ${jobId} completed; audio bytes=${audioBuffer.length}`);
  } catch (err) {
    const timedOut = err?.name === 'TimeoutError' || err?.name === 'AbortError';
    job.status = 'failed';
    job.error = timedOut ? 'MiniMax generation or audio download timed out. Check MiniMax status/account usage and try again.' : (String(err?.message || '').includes('48 MB') || String(err?.message || '').includes('generated audio') ? String(err.message).slice(0, 180) : 'Could not complete MiniMax generation. Check the Render runtime logs and your Music Generation API access.');
    job.updatedAt = Date.now();
    console.error(`[MiniMax] job ${jobId} failed: ${err?.name || 'Error'} ${String(err?.message || '').slice(0, 180)}`);
  } finally { activeJobs = Math.max(0, activeJobs - 1); }
}
app.get('/api/music/jobs/:jobId/audio', (req, res) => {
  pruneMaps();
  const job = jobs.get(req.params.jobId);
  if (!job || job.status !== 'complete' || !job.audioBuffer) return res.status(404).json({ error: 'Generated audio expired or is unavailable. Create the song again.' });
  const audio = job.audioBuffer;
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Cache-Control', 'private, max-age=300');
  const range = req.headers.range;
  if (range && /^bytes=\d*-\d*$/.test(range)) {
    const match = range.match(/^bytes=(\d*)-(\d*)$/);
    let start = match[1] ? Number(match[1]) : 0;
    let end = match[2] ? Number(match[2]) : audio.length - 1;
    if (!match[1] && match[2]) start = Math.max(0, audio.length - Number(match[2]));
    end = Math.min(end, audio.length - 1);
    if (start > end || start >= audio.length) return res.status(416).setHeader('Content-Range', `bytes */${audio.length}`).end();
    const chunk = audio.subarray(start, end + 1);
    res.status(206); res.setHeader('Content-Range', `bytes ${start}-${end}/${audio.length}`); res.setHeader('Content-Length', String(chunk.length)); return res.end(chunk);
  }
  res.setHeader('Content-Length', String(audio.length)); res.end(audio);
});
app.get('/api/music/jobs/:jobId', (req, res) => {
  pruneMaps();
  const job = jobs.get(req.params.jobId);
  if (!job) return res.status(404).json({ error: 'Generation job not found. It may have expired or the server may have restarted.' });
  if (job.status === 'failed') return res.json({ id: job.id, status: job.status, error: job.error });
  if (job.status === 'complete') return res.json({ id: job.id, status: job.status, song: job.song });
  return res.json({ id: job.id, status: job.status });
});
app.get('*', (_req, res) => res.sendFile(path.join(PUBLIC_DIR, 'index.html')));
app.listen(PORT, '0.0.0.0', () => console.log(`SONORA is running on port ${PORT}`));
