import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-card.component.html'
})
export class BookCardComponent {
  @Input() book!: Book;
  @Output() open = new EventEmitter<string>();

  openDetails() {
    this.open.emit(this.book.id);
  }
}
