import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import searchRoutes from './routes.js';

const app = express();
const PORT = process.env.SEARCH_SERVICE_PORT || 3002;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'search-service' }));

// Routes
app.use('/api/search', searchRoutes);

app.listen(PORT, () => {
  console.log(`🔍 Search Service running on port ${PORT}`);
});

export default app;
