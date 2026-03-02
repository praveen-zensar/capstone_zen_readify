import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Book } from '../../models/book.model';
import { BookService } from '../../services/book.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { BookCardComponent } from '../book-card/book-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, BookCardComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  query = '';
  genre: string | null = 'All';
  books: Book[] = [];
  genres: string[] = ['All', 'Fiction', 'Thriller', 'Self-Help'];

  bestSellers: Book[] = [];
  newArrivals: Book[] = [];
  editorsPicks: Book[] = [];

  constructor(private bs: BookService, private router: Router) {}

  ngOnInit() {
    // load categorized lists initially
    this.bs.getCategories().subscribe((cats) => {
      this.bestSellers = cats.bestSellers;
      this.newArrivals = cats.newArrivals;
      this.editorsPicks = cats.editorsPicks;
      // also keep mirrored books for search
      this.books = [...this.bestSellers, ...this.newArrivals, ...this.editorsPicks];
    });
  }

  search() {
    this.bs.searchAndFilter(this.query, this.genre).subscribe((results) => {
      this.books = results;
      this.updateSections();
    });
  }

  onGenreChange(g: string) {
    this.genre = g;
    this.search();
  }

  updateSections() {
    // categorize using either explicit flags or category string
    this.bestSellers = this.books.filter(
      (b) => b.bestseller || b.category === 'Best Seller'
    );
    this.newArrivals = this.books.filter(
      (b) => b.newArrival || b.category === 'New Arrival'
    );
    this.editorsPicks = this.books.filter(
      (b) => b.editorsPick || b.category === "Editor's Pick"
    );
  }

  openBook(id: string) {
    this.router.navigate(['/book', id]);
  }
}
