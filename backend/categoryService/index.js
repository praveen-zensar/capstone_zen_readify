require('dotenv').config({ path: __dirname + '/../.env' });
const express = require('express');
const cors = require('cors');
const categoryRoutes = require('./routes');

const app = express();
const PORT = process.env.CATEGORY_SERVICE_PORT || 3004;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'category-service' }));

// Routes
app.use('/api/categories', categoryRoutes);

app.listen(PORT, () => {
  console.log(`📂 Category Service running on port ${PORT}`);
});

module.exports = app;
