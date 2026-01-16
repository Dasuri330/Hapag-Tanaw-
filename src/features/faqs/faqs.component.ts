import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faqs',
  imports: [CommonModule],
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.css',
})
export class FAQsComponents {
  faqs$: Observable<FAQ[]>;

  constructor(private http: HttpClient) {
    this.faqs$ = this.http.get<{ faqs: FAQ[] }>('/data/faqs.json').pipe(
      map(data => data.faqs)
    );
  }
}