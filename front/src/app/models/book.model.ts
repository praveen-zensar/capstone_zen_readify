export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  category?: string;
  imageUrl?: string;
  cover?: string;
  bestseller?: boolean;
  newArrival?: boolean;
  editorsPick?: boolean;
  rating?: number;
  reviews?: { user: string; text: string }[];
}
