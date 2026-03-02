const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: 'text' },
    author: { type: String, required: true, index: 'text' },
    genre: { type: String, required: true },
    category: {
      type: String,
      enum: ['Best Seller', 'New Arrival', "Editor's Pick"],
      default: 'New Arrival',
    },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

// Compound text index for search
bookSchema.index({ title: 'text', author: 'text' });

module.exports = mongoose.model('Book', bookSchema);
