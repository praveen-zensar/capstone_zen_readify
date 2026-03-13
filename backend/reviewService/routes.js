import express from 'express';
import Review from './Review.js';
import { publish } from '../config/eventBus.js';
import { createServiceLogger } from '../config/logger.js';

const router = express.Router();
const log = createServiceLogger('review-routes');

// GET /api/reviews/:bookId – list all reviews for a book
router.get('/:bookId', async (req, res) => {
  try {
    const reviews = await Review.find({ bookId: req.params.bookId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reviews/:bookId – add a review
router.post('/:bookId', async (req, res) => {
  log.info('Adding review', { bookId: req.params.bookId });
  try {
    const review = await Review.create({
      ...req.body,
      bookId: req.params.bookId,
    });

    try {
      await publish('review:added', { bookId: req.params.bookId, reviewId: review._id });
    } catch (err) {
      log.warn('Failed to publish review:added event', {
        bookId: req.params.bookId,
        reviewId: review._id,
        error: err.message,
      });
    }

    res.status(201).json(review);
  } catch (err) {
    log.error('Failed to add review', { bookId: req.params.bookId, error: err.message });
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/reviews/:bookId/:reviewId – update a review
router.put('/:bookId/:reviewId', async (req, res) => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.reviewId, bookId: req.params.bookId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!review) return res.status(404).json({ error: 'Review not found' });

    try {
      await publish('review:updated', { bookId: req.params.bookId, reviewId: review._id });
    } catch (err) {
      log.warn('Failed to publish review:updated event', {
        bookId: req.params.bookId,
        reviewId: review._id,
        error: err.message,
      });
    }

    res.json(review);
  } catch (err) {
    log.error('Failed to update review', {
      bookId: req.params.bookId,
      reviewId: req.params.reviewId,
      error: err.message,
    });
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/reviews/:bookId/:reviewId – delete a review
router.delete('/:bookId/:reviewId', async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.reviewId,
      bookId: req.params.bookId,
    });
    if (!review) return res.status(404).json({ error: 'Review not found' });

    try {
      await publish('review:deleted', { bookId: req.params.bookId, reviewId: req.params.reviewId });
    } catch (err) {
      log.warn('Failed to publish review:deleted event', {
        bookId: req.params.bookId,
        reviewId: req.params.reviewId,
        error: err.message,
      });
    }

    res.json({ message: 'Review deleted' });
  } catch (err) {
    log.error('Failed to delete review', {
      bookId: req.params.bookId,
      reviewId: req.params.reviewId,
      error: err.message,
    });
    res.status(500).json({ error: err.message });
  }
});

export default router;
