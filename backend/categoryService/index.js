import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import categoryRoutes from './routes.js';
import { subscribe } from '../config/eventBus.js';
import { createServiceLogger } from '../config/logger.js';

const app = express();
const PORT = process.env.CATEGORY_SERVICE_PORT || 3004;
const log = createServiceLogger('category-service');

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'category-service' }));

// Routes
app.use('/', categoryRoutes);

app.listen(PORT, () => {
  log.info('Category Service running', { port: PORT });
});

// Subscribe to book lifecycle events for category synchronization hooks.
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
} catch (err) {
  log.warn('Redis not available - skipping event subscriptions', { error: err.message });
}

export default app;
