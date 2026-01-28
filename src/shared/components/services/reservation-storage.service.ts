import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReservationStorageService {
  private readonly STORAGE_KEY = 'reservationData';

  saveReservation(data: any): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }
  getReservation(): any {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;

  }
  clearReservation(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
  hasReservation(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }
}
