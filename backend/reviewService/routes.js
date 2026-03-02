const express = require('express');
const router = express.Router();
const Review = require('./Review');
const { publish } = require('../config/eventBus');

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
  try {
    const review = await Review.create({
      ...req.body,
      bookId: req.params.bookId,
    });

    try {
      await publish('review:added', { bookId: req.params.bookId, reviewId: review._id });
    } catch (_) {}

    res.status(201).json(review);
  } catch (err) {
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
    } catch (_) {}

    res.json(review);
  } catch (err) {
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
    } catch (_) {}

    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
