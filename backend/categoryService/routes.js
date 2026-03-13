import express from 'express';
import axios from 'axios';
import { createServiceLogger } from '../config/logger.js';

const router = express.Router();
const log = createServiceLogger('category-routes');

const BOOK_SERVICE_URL = process.env.BOOK_SERVICE_URL || 'http://localhost:3001';

// GET / – returns categorized book lists
router.get('/', async (req, res) => {
  try {
    const [bestSellers, newArrivals, editorsPicks] = await Promise.all([
      axios.get(`${BOOK_SERVICE_URL}`, { params: { category: 'best-seller' } }),
      axios.get(`${BOOK_SERVICE_URL}`, { params: { category: 'new-arrival' } }),
      axios.get(`${BOOK_SERVICE_URL}`, { params: { category: 'editors-pick' } }),
    ]);

    res.json({
      bestSellers: bestSellers.data,
      newArrivals: newArrivals.data,
      editorsPicks: editorsPicks.data,
    });
  } catch (err) {
    log.error('Category Service request failed', { error: err.message, route: '/' });
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /:category – books for a specific category
router.get('/:category', async (req, res) => {
  try {
    const { data: books } = await axios.get(`${BOOK_SERVICE_URL}`, {
      params: { category: req.params.category },
    });
    res.json(books);
  } catch (err) {
    log.error('Category Service request failed', {
      error: err.message,
      route: '/:category',
      category: req.params.category,
    });
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

export default router;
