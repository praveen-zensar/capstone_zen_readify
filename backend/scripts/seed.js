/**
 * Seed script – populates MongoDB with sample books.
 * Run: node scripts/seed.js
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import Book from '../bookService/Book.model.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zenreadify';

const books = [
  // Best Sellers
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    category: 'best-seller',
    description: 'A story of the mysteriously wealthy Jay Gatsby and his love for Daisy Buchanan.',
    imageUrl: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    category: 'best-seller',
    description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.',
    imageUrl: 'https://covers.openlibrary.org/b/id/8228691-L.jpg',
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-Help',
    category: 'best-seller',
    description: 'An easy & proven way to build good habits & break bad ones.',
    imageUrl: 'https://covers.openlibrary.org/b/id/10958382-L.jpg',
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Science Fiction',
    category: 'best-seller',
    description: 'Set on the desert planet Arrakis, Dune is the story of Paul Atreides and his quest for survival.',
    imageUrl: 'https://covers.openlibrary.org/b/id/11153217-L.jpg',
  },
  {
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian',
    category: 'best-seller',
    description: 'A chilling tale of totalitarianism and surveillance in a dystopian future.',
    imageUrl: 'https://covers.openlibrary.org/b/id/7878060-L.jpg',
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    genre: 'Fiction',
    category: 'best-seller',
    description: 'The story of teenage rebellion and alienation in mid-century New York.',
    imageUrl: 'https://covers.openlibrary.org/b/id/7846697-L.jpg',
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    category: 'best-seller',
    description: 'A timeless romance about Elizabeth Bennet and Mr. Darcy navigating social norms and love.',
    imageUrl: 'https://covers.openlibrary.org/b/id/7933025-L.jpg',
  },

  // New Arrivals
  {
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    genre: 'Science Fiction',
    category: 'new-arrival',
    description: 'A lone astronaut must save the earth from disaster in this propulsive interstellar adventure.',
    imageUrl: 'https://covers.openlibrary.org/b/id/10389354-L.jpg',
  },
  {
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    genre: 'Fiction',
    category: 'new-arrival',
    description: 'A magnificent new novel from the Nobel laureate about the wonders and dangers of technology.',
    imageUrl: 'https://covers.openlibrary.org/b/id/10368167-L.jpg',
  },
  {
    title: 'The Subtle Art of Not Giving a F*ck',
    author: 'Mark Manson',
    genre: 'Self-Help',
    category: 'new-arrival',
    description: 'A counterintuitive approach to living a good life.',
    imageUrl: 'https://covers.openlibrary.org/b/id/8513230-L.jpg',
  },
  {
    title: 'Demon Slayer: Kimetsu no Yaiba',
    author: 'Koyoharu Gotouge',
    genre: 'Manga',
    category: 'new-arrival',
    description: 'A thrilling manga about a young demon slayer on a quest to save his sister.',
    imageUrl: 'https://covers.openlibrary.org/b/id/9618159-L.jpg',
  },
  {
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    genre: 'Thriller',
    category: 'new-arrival',
    description: 'A psychological thriller about a woman who shoots her husband five times and never speaks again.',
    imageUrl: 'https://covers.openlibrary.org/b/id/10241563-L.jpg',
  },
  {
    title: 'Verity',
    author: 'Colleen Hoover',
    genre: 'Thriller',
    category: 'new-arrival',
    description: 'A dark and twisted novel full of shocking revelations and unexpected turns.',
    imageUrl: 'https://covers.openlibrary.org/b/id/9847730-L.jpg',
  },

  // Editors Picks
  {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    genre: 'Fiction',
    category: 'editors-pick',
    description: 'Between life and death there is a library. Nora Seed finds herself there with the chance to live different lives.',
    imageUrl: 'https://covers.openlibrary.org/b/id/10375950-L.jpg',
  },
  {
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    genre: 'Non-Fiction',
    category: 'editors-pick',
    description: 'A brief history of humankind, exploring how Homo sapiens came to dominate the planet.',
    imageUrl: 'https://covers.openlibrary.org/b/id/7882189-L.jpg',
  },
  {
    title: 'Educated',
    author: 'Tara Westover',
    genre: 'Memoir',
    category: 'editors-pick',
    description: 'A memoir about a woman who grows up in a survivalist family and eventually earns a PhD from Cambridge.',
    imageUrl: 'https://covers.openlibrary.org/b/id/8409502-L.jpg',
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    genre: 'Psychology',
    category: 'editors-pick',
    description: 'A groundbreaking exploration of human decision-making and the two systems of thought.',
    imageUrl: 'https://covers.openlibrary.org/b/id/8126784-L.jpg',
  },
  {
    title: 'The Art of War',
    author: 'Sun Tzu',
    genre: 'Philosophy',
    category: 'editors-pick',
    description: 'An ancient Chinese military treatise with timeless wisdom applicable to modern life.',
    imageUrl: 'https://covers.openlibrary.org/b/id/8260842-L.jpg',
  },
  {
    title: 'Braiding Sweetgrass',
    author: 'Robin Wall Kimmerer',
    genre: 'Nature',
    category: 'editors-pick',
    description: 'A beautiful exploration of indigenous wisdom and our relationship with the natural world.',
    imageUrl: 'https://covers.openlibrary.org/b/id/8989872-L.jpg',
  },

  // Additional Fiction Titles
  {
    title: 'The Book Thief',
    author: 'Markus Zusak',
    genre: 'Fiction',
    category: 'best-seller',
    description: 'A poignant story set in WWII Germany about a girl who steals books and shares them during air raids.',
    imageUrl: 'https://covers.openlibrary.org/b/id/8018313-L.jpg',
  },
  {
    title: 'Beloved',
    author: 'Toni Morrison',
    genre: 'Fiction',
    category: 'best-seller',
    description: 'A powerful novel about a formerly enslaved woman haunted by her traumatic past.',
    imageUrl: 'https://covers.openlibrary.org/b/id/7945869-L.jpg',
  },

  // Additional Science Fiction
  {
    title: 'The Foundation',
    author: 'Isaac Asimov',
    genre: 'Science Fiction',
    category: 'best-seller',
    description: 'An epic science fiction saga spanning thousands of years, exploring themes of prediction and decline of civilizations.',
    imageUrl: 'https://covers.openlibrary.org/b/id/7932868-L.jpg',
  },
  {
    title: 'Neuromancer',
    author: 'William Gibson',
    genre: 'Science Fiction',
    category: 'new-arrival',
    description: 'A cyberpunk classic that defined the genre, exploring virtual reality and artificial intelligence.',
    imageUrl: 'https://covers.openlibrary.org/b/id/7854486-L.jpg',
  },

  // Self-Help & Personal Development
  {
    title: 'The 7 Habits of Highly Effective People',
    author: 'Stephen R. Covey',
    genre: 'Self-Help',
    category: 'best-seller',
    description: 'A comprehensive guide to personal and professional effectiveness based on timeless principles.',
    imageUrl: 'https://covers.openlibrary.org/b/id/7836457-L.jpg',
  },
  {
    title: 'Deep Work',
    author: 'Cal Newport',
    genre: 'Self-Help',
    category: 'editors-pick',
    description: 'A practical guide to achieving peak focus and productivity in a distracted world.',
    imageUrl: 'https://covers.openlibrary.org/b/id/8956234-L.jpg',
  },

  // Mystery & Thriller
  {
    title: 'The Girl with the Dragon Tattoo',
    author: 'Stieg Larsson',
    genre: 'Thriller',
    category: 'best-seller',
    description: 'A gripping mystery about a journalist and a hacker uncovering dark family secrets.',
    imageUrl: 'https://covers.openlibrary.org/b/id/8084486-L.jpg',
  },
  {
    title: 'And Then There Were None',
    author: 'Agatha Christie',
    genre: 'Mystery',
    category: 'editors-pick',
    description: 'A masterpiece of mystery where ten strangers are brought to an island and accused of heinous crimes.',
    imageUrl: 'https://covers.openlibrary.org/b/id/7936842-L.jpg',
  },

  // Fantasy
  {
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    category: 'best-seller',
    description: 'An epic fantasy about hobbits, wizards, and the quest to destroy a powerful ring.',
    imageUrl: 'https://covers.openlibrary.org/b/id/7940267-L.jpg',
  },
  {
    title: 'A Game of Thrones',
    author: 'George R.R. Martin',
    genre: 'Fantasy',
    category: 'best-seller',
    description: 'A complex fantasy epic filled with political intrigue, magic, and unpredictable characters.',
    imageUrl: 'https://covers.openlibrary.org/b/id/7955042-L.jpg',
  },

  // Young Adult
  {
    title: 'The Hunger Games',
    author: 'Suzanne Collins',
    genre: 'Young Adult',
    category: 'best-seller',
    description: 'A dystopian youth novel about teenagers forced to fight to the death in a televised spectacle.',
    imageUrl: 'https://covers.openlibrary.org/b/id/8065542-L.jpg',
  },
  {
    title: 'Percy Jackson & The Olympians',
    author: 'Rick Riordan',
    genre: 'Young Adult',
    category: 'new-arrival',
    description: 'An adventure series about a teenager discovering he is the son of a Greek god.',
    imageUrl: 'https://covers.openlibrary.org/b/id/7954689-L.jpg',
  },

  // Biographies & History
  {
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    genre: 'Biography',
    category: 'editors-pick',
    description: 'An intimate biography of one of the most innovative and controversial figures of our time.',
    imageUrl: 'https://covers.openlibrary.org/b/id/8047382-L.jpg',
  },
  {
    title: 'The Code Breaker',
    author: 'Walter Isaacson',
    genre: 'Biography',
    category: 'new-arrival',
    description: 'A biography of Jennifer Doudna, one of the scientists behind CRISPR gene editing.',
    imageUrl: 'https://covers.openlibrary.org/b/id/9785642-L.jpg',
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
