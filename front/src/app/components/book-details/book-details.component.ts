import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../../models/book.model';
import { BookService, Review } from '../../services/book.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './book-details.component.html'
})
export class BookDetailsComponent implements OnInit {
  book?: Book;
  tab: 'description' | 'reviews' = 'description';
  reviews: Review[] = [];
  loadingReviews = false;

  constructor(private route: ActivatedRoute, private bs: BookService, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.bs.getBookById(id).subscribe((b) => {
      if (!b) {
        this.router.navigate(['/']);
        return;
      }
      this.book = b;
    });
  }

  /** called when user wants to view the reviews tab */
  showReviews() {
    this.tab = 'reviews';
    if (this.reviews.length === 0 && this.book?.id) {
      this.loadingReviews = true;
      this.bs.getReviews(this.book.id).subscribe(
        (r) => {
          this.reviews = r;
          this.loadingReviews = false;
        },
        (err) => {
          console.error('[BookDetails] failed to load reviews', err);
          this.loadingReviews = false;
        }
      );
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
