import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
    providedIn: 'root'
})
export class FoodPackageService {
    private apiUrl = 'http://localhost:3000/foodPackages';

    constructor(private http: HttpClient) { }

    // Get all food packages
    getFoodPackages(): Observable<FoodPackage[]> {
        return this.http.get<FoodPackage[]>(this.apiUrl);
    }

    // Get a single food package by ID
    getFoodPackageById(id: number): Observable<FoodPackage> {
        return this.http.get<FoodPackage>(`${this.apiUrl}/${id}`);
    }

    // Add a new food package (optional - for admin features)
    addFoodPackage(foodPackage: FoodPackage): Observable<FoodPackage> {
        return this.http.post<FoodPackage>(this.apiUrl, foodPackage);
    }

    // Update a food package (optional - for admin features)
    updateFoodPackage(id: number, foodPackage: FoodPackage): Observable<FoodPackage> {
        return this.http.put<FoodPackage>(`${this.apiUrl}/${id}`, foodPackage);
    }

    // Delete a food package (optional - for admin features)
    deleteFoodPackage(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}