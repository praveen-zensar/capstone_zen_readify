import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import searchRoutes from './routes.js';
import { subscribe } from '../config/eventBus.js';
import { createServiceLogger } from '../config/logger.js';

const app = express();
const PORT = process.env.SEARCH_SERVICE_PORT || 3002;
const log = createServiceLogger('search-service');

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'search-service' }));

// Routes
app.use('/', searchRoutes);

app.listen(PORT, () => {
  log.info('Search Service running', { port: PORT });
});

// Subscribe to domain events for search synchronization hooks.
try {
  subscribe('book:added', (data) => {
    log.info('Received book:added event', { bookId: data.bookId });
  });

  subscribe('book:updated', (data) => {
    log.info('Received book:updated event', { bookId: data.bookId });
  });

  subscribe('book:deleted', (data) => {
    log.info('Received book:deleted event', { bookId: data.bookId });
  });

  subscribe('review:added', (data) => {
    log.info('Received review:added event', { bookId: data.bookId });
  });

  subscribe('review:updated', (data) => {
    log.info('Received review:updated event', { bookId: data.bookId });
  });

  subscribe('review:deleted', (data) => {
    log.info('Received review:deleted event', { bookId: data.bookId });
  });
} catch (err) {
  log.warn('Redis not available - skipping event subscriptions', { error: err.message });
}

export default app;
