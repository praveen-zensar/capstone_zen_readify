import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import categoryRoutes from './routes.js';

const app = express();
const PORT = process.env.CATEGORY_SERVICE_PORT || 3004;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'category-service' }));

// Routes
app.use('/', categoryRoutes);

app.listen(PORT, () => {
  console.log(`📂 Category Service running on port ${PORT}`);
});

export default app;
