require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const { authenticate } = require('./auth');
const logger = require('./logger');

const app = express();
const PORT = process.env.GATEWAY_PORT || 3000;

// ── Service URLs ──────────────────────────────────────────────
const BOOK_SERVICE_URL = process.env.BOOK_SERVICE_URL || 'http://localhost:3001';
const SEARCH_SERVICE_URL = process.env.SEARCH_SERVICE_URL || 'http://localhost:3002';
const REVIEW_SERVICE_URL = process.env.REVIEW_SERVICE_URL || 'http://localhost:3003';
const CATEGORY_SERVICE_URL = process.env.CATEGORY_SERVICE_URL || 'http://localhost:3004';

// ── Global Middleware ─────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(logger);

// ── Rate Limiting ─────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use(limiter);

// ── Health Check ──────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'api-gateway' }));

// ── Aggregation: Book + Reviews ─────────────────────────────
// GET /api/books/:id/details  → combined book metadata + reviews
app.get('/api/books/:id/details', async (req, res) => {
  try {
    const [bookRes, reviewsRes] = await Promise.all([
      axios.get(`${BOOK_SERVICE_URL}/api/books/${req.params.id}`),
      axios.get(`${REVIEW_SERVICE_URL}/api/reviews/${req.params.id}`),
    ]);
    res.json({ ...bookRes.data, reviews: reviewsRes.data });
  } catch (err) {
    console.error('Aggregation error:', err.message);
    res.status(500).json({ error: 'Failed to aggregate book details' });
  }
});

// ── Proxy: Book Service ──────────────────────────────────────
app.use(
  '/api/books',
  createProxyMiddleware({
    target: BOOK_SERVICE_URL,
    changeOrigin: true,
  })
);

// ── Proxy: Search Service ────────────────────────────────────
app.use(
  '/api/search',
  createProxyMiddleware({
    target: SEARCH_SERVICE_URL,
    changeOrigin: true,
  })
);

// ── Proxy: Review Service ────────────────────────────────────
app.use(
  '/api/reviews',
  createProxyMiddleware({
    target: REVIEW_SERVICE_URL,
    changeOrigin: true,
  })
);

// ── Proxy: Category Service ──────────────────────────────────
app.use(
  '/api/categories',
  createProxyMiddleware({
    target: CATEGORY_SERVICE_URL,
    changeOrigin: true,
  })
);

// ── Protected route example (requires JWT) ───────────────────
app.get('/api/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// ── Start Gateway ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`   → Book Service:     ${BOOK_SERVICE_URL}`);
  console.log(`   → Search Service:   ${SEARCH_SERVICE_URL}`);
  console.log(`   → Review Service:   ${REVIEW_SERVICE_URL}`);
  console.log(`   → Category Service: ${CATEGORY_SERVICE_URL}`);
});

module.exports = app;