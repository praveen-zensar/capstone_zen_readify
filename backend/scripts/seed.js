/**
 * Seed script – populates MongoDB with sample books.
 * Run: node scripts/seed.js
 */
require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Book = require('../bookService/Book');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zenreadify';

const books = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    category: 'Best Seller',
    description: 'A story of the mysteriously wealthy Jay Gatsby and his love for Daisy Buchanan.',
    imageUrl: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    category: 'Best Seller',
    description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.',
    imageUrl: 'https://covers.openlibrary.org/b/id/8228691-L.jpg',
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-Help',
    category: 'Best Seller',
    description: 'An easy & proven way to build good habits & break bad ones.',
    imageUrl: 'https://covers.openlibrary.org/b/id/10958382-L.jpg',
  },
  {
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    genre: 'Science Fiction',
    category: 'New Arrival',
    description: 'A lone astronaut must save the earth from disaster in this propulsive interstellar adventure.',
    imageUrl: 'https://covers.openlibrary.org/b/id/10389354-L.jpg',
  },
  {
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    genre: 'Fiction',
    category: 'New Arrival',
    description: 'A magnificent new novel from the Nobel laureate about the wonders and dangers of technology.',
    imageUrl: 'https://covers.openlibrary.org/b/id/10368167-L.jpg',
  },
  {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    genre: 'Fiction',
    category: "Editor's Pick",
    description: 'Between life and death there is a library. Nora Seed finds herself there with the chance to live different lives.',
    imageUrl: 'https://covers.openlibrary.org/b/id/10375950-L.jpg',
  },
  {
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    genre: 'Non-Fiction',
    category: "Editor's Pick",
    description: 'A brief history of humankind, exploring how Homo sapiens came to dominate the planet.',
    imageUrl: 'https://covers.openlibrary.org/b/id/7882189-L.jpg',
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Science Fiction',
    category: 'Best Seller',
    description: 'Set on the desert planet Arrakis, Dune is the story of Paul Atreides and his quest for survival.',
    imageUrl: 'https://covers.openlibrary.org/b/id/11153217-L.jpg',
  },
  {
    title: 'The Subtle Art of Not Giving a F*ck',
    author: 'Mark Manson',
    genre: 'Self-Help',
    category: 'New Arrival',
    description: 'A counterintuitive approach to living a good life.',
    imageUrl: 'https://covers.openlibrary.org/b/id/8513230-L.jpg',
  },
  {
    title: 'Educated',
    author: 'Tara Westover',
    genre: 'Memoir',
    category: "Editor's Pick",
    description: 'A memoir about a woman who grows up in a survivalist family and eventually earns a PhD from Cambridge.',
    imageUrl: 'https://covers.openlibrary.org/b/id/8409502-L.jpg',
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await Book.deleteMany({});
    console.log('Cleared existing books');

    const inserted = await Book.insertMany(books);
    console.log(`Seeded ${inserted.length} books`);

    await mongoose.disconnect();
    console.log('Done!');
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
