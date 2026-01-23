import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { FaqsService } from '@shared/components/services/faqs';
import { FAQ } from '@shared/components/model/faqs-model';


@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.css',
})
export class FAQsComponents {
  faqs$: Observable<FAQ[]>;

  constructor(private http: HttpClient, private faqsService: FaqsService) {
    this.faqs$ = this.faqsService.getFaqs();
  }
}