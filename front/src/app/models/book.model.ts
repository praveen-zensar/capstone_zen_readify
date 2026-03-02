export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  category?: string; // e.g. 'Best Seller', 'New Arrival', "Editor's Pick"

  // backend stores an imageUrl field, map to this when received
  imageUrl?: string;
  // convenience property used by UI
  cover?: string;

  // category flags (may be derived from backend 'category')
  bestseller?: boolean;
  newArrival?: boolean;
  editorsPick?: boolean;
  rating?: number;
  reviews?: { user: string; text: string }[];
}
