import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from '../config/db.js';
import bookRoutes from './routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.BOOK_SERVICE_PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zenreadify';

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'book-service' }));

// Routes
app.use('/api/books', bookRoutes);

connectDB(MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`📚 Book Service running on port ${PORT}`);
  });
});

export default app;
