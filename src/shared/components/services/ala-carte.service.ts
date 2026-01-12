import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface MenuItem {
  image: string;
  title: string;
  price: string;
}

export interface SelectedItem extends MenuItem {
  quantity: number;
}

export interface MenuSection {
  id: string;
  title: string;
  items: MenuItem[];
}

@Injectable({
  providedIn: 'root'
})
export class AlaCarteService {

  constructor(private http: HttpClient) {
    console.log('AlaCarteService constructor called');
  }

  
  getAlaCarteMenu(): Observable<MenuSection[]> {
    console.log('Fetching ala carte menu from: data/ala-carte.json');
    
    return this.http.get<MenuSection[]>('data/ala-carte.json').pipe(
      tap(data => {
        console.log('Ala carte menu data received successfully:', data);
      }),
      catchError(error => {
        console.error('Error fetching ala carte menu:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        return of([]);  
      })
    );
  }
}