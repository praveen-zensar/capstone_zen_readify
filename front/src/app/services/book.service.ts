import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';

export interface Review {
  _id: string;
  bookId: string;
  user: string;
  text: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class BookService {
  private baseUrl = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) {}

  /** list all books (optional filters applied by searchService) */
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}/books`);
  }

  /** fetch a single book by id */
  getBookById(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.baseUrl}/books/${id}`);
  }

  /** search and/or filter using searchService */
  searchAndFilter(query: string, genre: string | null): Observable<Book[]> {
    let params = new HttpParams();
    if (query) params = params.set('q', query);
    if (genre && genre !== 'All') params = params.set('genre', genre);
    return this.http.get<Book[]>(`${this.baseUrl}/search`, { params });
  }

  /** get categorized lists from category service */
  getCategories(): Observable<{ bestSellers: Book[]; newArrivals: Book[]; editorsPicks: Book[] }> {
    return this.http.get<{ bestSellers: Book[]; newArrivals: Book[]; editorsPicks: Book[] }>(
      `${this.baseUrl}/categories`
    );
  }

  /** reviews endpoints */
  getReviews(bookId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/reviews/${bookId}`);
  }
}
