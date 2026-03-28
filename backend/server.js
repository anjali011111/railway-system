// ============================================================
//  server.js  —  The HEART of the backend
//
//  This is the main file that:
//  1. Creates an Express web server
//  2. Registers all API routes
//  3. Starts listening on port 3000
// ============================================================

const express = require('express');
const cors    = require('cors');

const trainRoutes     = require('./routes/trains');
const passengerRoutes = require('./routes/passengers');
const ticketRoutes    = require('./routes/tickets');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── MIDDLEWARE ────────────────────────────────────────────────
// Middleware = code that runs on EVERY request before the route handler

// cors() allows your HTML file (on any origin) to talk to this server.
// Without this, the browser blocks the request with a CORS error.
app.use(cors());

// express.json() reads the request body as JSON.
// Without this, req.body would be undefined.
app.use(express.json());

// ── SERVE FRONTEND ────────────────────────────────────────────
// index.html lives at the repo root (one level above backend/).
// express.static serves it and any other assets from that folder.
app.use(express.static(require('path').join(__dirname, '..')));

// ── ROUTES ───────────────────────────────────────────────────
// All train  endpoints  → /api/trains/...
// All passenger         → /api/passengers/...
// All ticket            → /api/tickets/...
app.use('/api/trains',     trainRoutes);
app.use('/api/passengers', passengerRoutes);
app.use('/api/tickets',    ticketRoutes);

// ── ROOT CHECK ───────────────────────────────────────────────
// Visit http://localhost:3000/api to confirm server is running
app.get('/api', (req, res) => {
  res.json({ message: '🚂 Railway API is running!', status: 'ok' });
});

// ── START SERVER ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Railway backend running at http://localhost:${PORT}`);
  console.log(`📄  Environment: ${process.env.NODE_ENV || 'development'}`);
});