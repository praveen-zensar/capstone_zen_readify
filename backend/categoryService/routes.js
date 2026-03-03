import express from 'express';
import axios from 'axios';

const router = express.Router();

const BOOK_SERVICE_URL = process.env.BOOK_SERVICE_URL || 'http://localhost:3001';

// GET /api/categories – returns categorized book lists
router.get('/', async (req, res) => {
  try {
    const [bestSellers, newArrivals, editorsPicks] = await Promise.all([
      axios.get(`${BOOK_SERVICE_URL}/api/books`, { params: { category: 'Best Seller' } }),
      axios.get(`${BOOK_SERVICE_URL}/api/books`, { params: { category: 'New Arrival' } }),
      axios.get(`${BOOK_SERVICE_URL}/api/books`, { params: { category: "Editor's Pick" } }),
    ]);

    res.json({
      bestSellers: bestSellers.data,
      newArrivals: newArrivals.data,
      editorsPicks: editorsPicks.data,
    });
  } catch (err) {
    console.error('Category Service error:', err.message);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/categories/:category – books for a specific category
router.get('/:category', async (req, res) => {
  try {
    const { data: books } = await axios.get(`${BOOK_SERVICE_URL}/api/books`, {
      params: { category: req.params.category },
    });
    res.json(books);
  } catch (err) {
    console.error('Category Service error:', err.message);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

export default router;
