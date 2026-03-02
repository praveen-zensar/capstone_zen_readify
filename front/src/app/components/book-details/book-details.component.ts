import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../../models/book.model';
import { BookService } from '../../services/book.service';
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
  reviews: any[] = [];

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

    // fetch reviews as well
    this.bs.getReviews(id).subscribe((r) => {
      this.reviews = r;
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
