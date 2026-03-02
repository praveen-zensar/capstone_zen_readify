const express = require('express');
const router = express.Router();
const axios = require('axios');

const BOOK_SERVICE_URL = process.env.BOOK_SERVICE_URL || 'http://localhost:3001';

// GET /api/search?q=&genre=
router.get('/', async (req, res) => {
  try {
    const { q, genre } = req.query;

    // Build query params to forward to Book Service
    const params = {};
    if (genre) params.genre = genre;

    // Fetch all books (optionally filtered by genre) from Book Service
    const { data: books } = await axios.get(`${BOOK_SERVICE_URL}/api/books`, { params });

    let results = books;

    // Text-based search on title and author
    if (q) {
      const query = q.toLowerCase();
      results = results.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
      );
    }

    res.json(results);
  } catch (err) {
    console.error('Search Service error:', err.message);
    res.status(500).json({ error: 'Failed to search books' });
  }
});

module.exports = router;
