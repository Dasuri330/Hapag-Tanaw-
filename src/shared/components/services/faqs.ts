import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

@Injectable({
  providedIn: 'root',
})
export class FaqsService {
  constructor(private http: HttpClient) { }

  getFaqs(): Observable<FAQ[]> {
    return this.http.get<{ faqs: FAQ[] }>('/data/faqs.json').pipe(
      map(data => data.faqs)
    );
  }

}
