import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'book/:id', component: BookDetailsComponent },
  { path: '**', redirectTo: '' }
];
