require('dotenv').config({ path: __dirname + '/../.env' });
const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db');
const reviewRoutes = require('./routes');
const { subscribe } = require('../config/eventBus');
const Review = require('./Review');

const app = express();
const PORT = process.env.REVIEW_SERVICE_PORT || 3003;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zenreadify';

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'review-service' }));

// Routes
app.use('/api/reviews', reviewRoutes);

connectDB(MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`⭐ Review Service running on port ${PORT}`);
  });

  // Subscribe to book deletion events – cascade delete reviews
  try {
    subscribe('book:deleted', async (data) => {
      console.log(`Received book:deleted event for book ${data.bookId}`);
      await Review.deleteMany({ bookId: data.bookId });
      console.log(`Deleted reviews for book ${data.bookId}`);
    });
  } catch (_) {
    console.log('Redis not available – skipping event subscriptions');
  }
});

module.exports = app;
