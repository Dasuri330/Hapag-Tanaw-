import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface FoodPackage {
  id?: number;
  title: string;
  persons: string;
  menuItems: string[];
  price: string;
  priceValue?: number | null;
  image: string;
  imageAlt: string;
  selected?: boolean;
}

interface FoodPackageResponse {
  foodPackages: FoodPackage[];
}

@Injectable({
  providedIn: 'root'
})
export class FoodPackageService {

  constructor(private http: HttpClient) {
    console.log('FoodPackageService constructor called');
  }


  getFoodPackages(): Observable<FoodPackageResponse> {
    console.log('Fetching food packages from: data/food-package.json');

    return this.http.get<FoodPackageResponse>('data/food-package.json').pipe(
      // Extract the foodPackages array from the response
      map(response => {
        console.log('Raw response:', response);
        return response;
      }),

      // Log successful data retrieval
      tap(packages => {
        console.log('Food packages received successfully:', packages);
        console.log('Number of packages:', packages.foodPackages.length);
      }),

      // Handle errors
      catchError(error => {
        console.error('Error fetching food packages:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);

        // Return empty array on error
        return of();
      })
    );
  }
}