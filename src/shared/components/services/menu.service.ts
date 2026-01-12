import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface MenuItem {
  image: string;
  title: string;
  description: string;
  price: string;
}

export interface MenuSection {
  id: string;
  title: string;
  items: MenuItem[];
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) {
    console.log('MenuService constructor called');
  }

  getMenuSections(): Observable<MenuSection[]> {
    console.log('Fetching menu from: /data/menu.json');
    
    return this.http.get<MenuSection[]>('/data/menu.json').pipe(
      tap(data => {
        console.log('Menu data received successfully:', data);
      }),
      catchError(error => {
        console.error('Error fetching menu:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        return of([]); 
      })
    );
  }
}