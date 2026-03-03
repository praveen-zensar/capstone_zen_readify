import express from 'express';
import BooksModel from './Book.model.js';
import { publish } from '../config/eventBus.js';

const router = express.Router();

// GET /api/books – list all books (supports ?genre= & ?category= query params)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.genre) filter.genre = req.query.genre;
    if (req.query.category) filter.category = req.query.category;

    const books = await BooksModel.find(filter).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/books/:id – single book
router.get('/:id', async (req, res) => {
  try {
    const book = await BooksModel.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/books – create a new book
router.post('/', async (req, res) => {
  try {
    const book = await BooksModel.create(req.body);

    // Publish event: new book added
    try {
      await publish('book:added', { bookId: book._id, title: book.title, category: book.category });
    } catch (_) {
      /* Redis may not be running – non-critical */
    }

    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/books/:id – update a book
router.put('/:id', async (req, res) => {
  try {
    const book = await BooksModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) return res.status(404).json({ error: 'Book not found' });

    try {
      await publish('book:updated', { bookId: book._id, title: book.title });
    } catch (_) {}

    res.json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/books/:id – delete a book
router.delete('/:id', async (req, res) => {
  try {
    const book = await BooksModel.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    try {
      await publish('book:deleted', { bookId: req.params.id });
    } catch (_) {}

    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
