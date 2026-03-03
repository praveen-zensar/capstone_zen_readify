import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import rateLimit from 'express-rate-limit';
import axios from 'axios';
import { authenticate } from './auth.js';
import logger from './logger.js';

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

// Request path logging for debugging
app.use((req, res, next) => {
  console.log(`[GATEWAY] ${req.method} ${req.path}`);
  next();
});

// ── Health Check ──────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'api-gateway' }));

// ── Diagnostic: Test Category Service ──────────────────────────
app.get('/health', async (req, res) => {
  try {
    const response = await axios.get(`${CATEGORY_SERVICE_URL}/health`, { timeout: 5000 });
    res.json({ status: 'ok', categoryServiceHealth: response.data });
  } catch (err) {
    console.error(`Cannot reach Category Service at ${CATEGORY_SERVICE_URL}:`, err.message);
    res.status(503).json({ 
      status: 'error', 
      message: 'Category Service unreachable',
      categoryServiceUrl: CATEGORY_SERVICE_URL,
      error: err.message 
    });
  }
});

// ── Aggregation: Book + Reviews ─────────────────────────────
// GET /api/books/:id/details  → combined book metadata + reviews
app.get('/api/books/:id/details', async (req, res) => {
  try {
    const [bookRes, reviewsRes] = await Promise.all([
      axios.get(`${BOOK_SERVICE_URL}/${req.params.id}`),
      axios.get(`${REVIEW_SERVICE_URL}/${req.params.id}`),
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
    onError: (err, req, res) => {
      console.error('Book Service proxy error:', err.message);
      res.status(503).json({ error: 'Book Service unavailable' });
    },
  })
);

// ── Proxy: Search Service ────────────────────────────────────
app.use(
  '/api/search',
  createProxyMiddleware({
    target: SEARCH_SERVICE_URL,
    changeOrigin: true,
    onError: (err, req, res) => {
      console.error('Search Service proxy error:', err.message);
      res.status(503).json({ error: 'Search Service unavailable' });
    },
  })
);

// ── Proxy: Review Service ────────────────────────────────────
app.use(
  '/api/reviews',
  createProxyMiddleware({
    target: REVIEW_SERVICE_URL,
    changeOrigin: true,
    onError: (err, req, res) => {
      console.error('Review Service proxy error:', err.message);
      res.status(503).json({ error: 'Review Service unavailable' });
    },
  })
);

// ── Proxy: Category Service ──────────────────────────────────
app.use(
  '/api/categories',
  createProxyMiddleware({
    target: CATEGORY_SERVICE_URL,
    changeOrigin: true,
    logLevel: 'debug',
    onError: (err, req, res) => {
      console.error(`Category Service proxy error on ${req.method} ${req.url}:`, err.message);
      res.status(503).json({ error: 'Category Service unavailable' });
    },
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

export default app;