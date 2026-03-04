import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book } from '../models/book.model';

export interface Review {
  _id: string;
  bookId: string;
  user: string; // mapped from reviewer
  text: string; // mapped from comment
  rating?: number;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class BookService {
  // use relative path so angular dev-server proxy or deployment host can handle
  private baseUrl = '/api';

  constructor(private http: HttpClient) {}

  /** helper to convert backend book to front-end model */
  private normalize(b: any): Book {
    return {
      ...b,
      id: b._id || b.id,
      cover: b.cover || b.imageUrl,
    } as Book;
  }

  private normalizeArray(arr: any[]): Book[] {
    return arr.map((b) => this.normalize(b));
  }

  /** list all books (optional filters applied by searchService) */
  getBooks(): Observable<Book[]> {
    return this.http.get<any[]>(`${this.baseUrl}/books`).pipe(
      map((arr) => this.normalizeArray(arr))
    );
  }

  /** fetch a single book by id */
  getBookById(id: string): Observable<Book> {
    return this.http.get<any>(`${this.baseUrl}/books/${id}`).pipe(
      map((b) => this.normalize(b))
    );
  }

  /** search and/or filter using searchService */
  searchAndFilter(query: string, genre: string | null): Observable<Book[]> {
    let params = new HttpParams();
    if (query) params = params.set('q', query);
    if (genre && genre !== 'All') params = params.set('genre', genre);
    return this.http.get<any[]>(`${this.baseUrl}/search`, { params }).pipe(
      map((arr) => this.normalizeArray(arr))
    );
  }

  /** get categorized lists from category service */
  getCategories(): Observable<{ bestSellers: Book[]; newArrivals: Book[]; editorsPicks: Book[] }> {
    return this.http
      .get<any>(`${this.baseUrl}/categories`)
      .pipe(
        map((cats) => ({
          bestSellers: this.normalizeArray(cats.bestSellers),
          newArrivals: this.normalizeArray(cats.newArrivals),
          editorsPicks: this.normalizeArray(cats.editorsPicks),
        }))
      );
  }

  /** reviews endpoints */
  getReviews(bookId: string): Observable<Review[]> {
    return this.http.get<any[]>(`${this.baseUrl}/reviews/${bookId}`).pipe(
      map((arr) =>
        arr.map((r) => ({
          _id: r._id,
          bookId: r.bookId,
          user: r.reviewer || r.user,
          text: r.comment || r.text,
          rating: r.rating,
          createdAt: r.createdAt,
        } as Review))
      )
    );
  }
}
