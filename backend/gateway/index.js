import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import rateLimit from 'express-rate-limit';
import axios from 'axios';
import requestLogger, { createServiceLogger } from '../config/logger.js';

const app = express();
const PORT = process.env.GATEWAY_PORT || 3000;
const log = createServiceLogger('gateway');

// ── Service URLs ──────────────────────────────────────────────
const BOOK_SERVICE_URL = process.env.BOOK_SERVICE_URL || 'http://localhost:3001';
const SEARCH_SERVICE_URL = process.env.SEARCH_SERVICE_URL || 'http://localhost:3002';
const REVIEW_SERVICE_URL = process.env.REVIEW_SERVICE_URL || 'http://localhost:3003';
const CATEGORY_SERVICE_URL = process.env.CATEGORY_SERVICE_URL || 'http://localhost:3004';

// ── Global Middleware ─────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(requestLogger);

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
  log.info('Incoming request', { method: req.method, path: req.path });
  next();
});

// ── Health Check ──────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'api-gateway' }));

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
    log.error('Aggregation error', { error: err.message, bookId: req.params.id });
    res.status(500).json({ error: 'Failed to aggregate book details' });
  }
});

// ── Proxy: Book Service ──────────────────────────────────────
app.use(
  '/api/books',
  createProxyMiddleware({
    target: BOOK_SERVICE_URL,
    changeOrigin: true,
    on: {
      proxyReq: fixRequestBody,
    },
    onError: (err, req, res) => {
      log.error('Book Service proxy error', { error: err.message, method: req.method, url: req.url });
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
    on: {
      proxyReq: fixRequestBody,
    },
    onError: (err, req, res) => {
      log.error('Search Service proxy error', { error: err.message, method: req.method, url: req.url });
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
    on: {
      proxyReq: fixRequestBody,
    },
    onError: (err, req, res) => {
      log.error('Review Service proxy error', { error: err.message, method: req.method, url: req.url });
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
    on: {
      proxyReq: fixRequestBody,
    },
    onError: (err, req, res) => {
      log.error('Category Service proxy error', { error: err.message, method: req.method, url: req.url });
      res.status(503).json({ error: 'Category Service unavailable' });
    },
  })
);

// ── Start Gateway ─────────────────────────────────────────────
app.listen(PORT, () => {
  log.info('API Gateway running', { port: PORT });
  log.info('Service targets', {
    books: BOOK_SERVICE_URL,
    search: SEARCH_SERVICE_URL,
    reviews: REVIEW_SERVICE_URL,
    categories: CATEGORY_SERVICE_URL,
  });
});

export default app;