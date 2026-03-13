import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from '../config/db.js';
import reviewRoutes from './routes.js';
import { subscribe } from '../config/eventBus.js';
import Review from './Review.js';
import { createServiceLogger } from '../config/logger.js';

const app = express();
const PORT = process.env.REVIEW_SERVICE_PORT || 3003;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zenreadify';
const log = createServiceLogger('review-service');

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'review-service' }));

// Routes
app.use('/', reviewRoutes);

try {
  await connectDB(MONGO_URI);

  app.listen(PORT, () => {
    log.info('Review Service running', { port: PORT });
  });

  // Subscribe to book deletion events – cascade delete reviews
  try {
    subscribe('book:deleted', async (data) => {
      log.info('Received book:deleted event', { bookId: data.bookId });
      await Review.deleteMany({ bookId: data.bookId });
      log.info('Deleted reviews for book', { bookId: data.bookId });
    });
  } catch (err) {
    log.warn('Redis not available - skipping event subscriptions', { error: err.message });
  }
} catch (err) {
  log.error('Review Service startup failed', { error: err.message });
  process.exit(1);
}

export default app;
