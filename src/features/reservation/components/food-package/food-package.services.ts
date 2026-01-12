import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface FoodPackageComponent {
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
    getFoodPackages(): Observable<FoodPackageComponent[]> {
        return this.http.get<FoodPackageComponent[]>(this.apiUrl);
    }

    // Get a single food package by ID
    getFoodPackageById(id: number): Observable<FoodPackageComponent> {
        return this.http.get<FoodPackageComponent>(`${this.apiUrl}/${id}`);
    }

    // Add a new food package (optional - for admin features)
    addFoodPackage(foodPackage: FoodPackageComponent): Observable<FoodPackageComponent> {
        return this.http.post<FoodPackageComponent>(this.apiUrl, foodPackage);
    }

    // Update a food package (optional - for admin features)
    updateFoodPackage(id: number, foodPackage: FoodPackageComponent): Observable<FoodPackageComponent> {
        return this.http.put<FoodPackageComponent>(`${this.apiUrl}/${id}`, foodPackage);
    }

    // Delete a food package (optional - for admin features)
    deleteFoodPackage(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}