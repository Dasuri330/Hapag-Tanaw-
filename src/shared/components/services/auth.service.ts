import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor() {
    // ⬅️ Current user from sessionStorage (clears on browser close)
    const storedUser = sessionStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  // ⬅️ Registered users stay in localStorage (persistent)
  private getAllUsers(): User[] {
    const users = localStorage.getItem('registeredUsers');
    return users ? JSON.parse(users) : [];
  }

  private saveAllUsers(users: User[]): void {
    localStorage.setItem('registeredUsers', JSON.stringify(users));
  }

  emailExists(email: string): boolean {
    const users = this.getAllUsers();
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
  }

  signup(userData: Omit<User, 'id' | 'token'>): { success: boolean; message: string } {
    if (this.emailExists(userData.email)) {
      return {
        success: false,
        message: 'Email already registered. Please use a different email or login.'
      };
    }

    const users = this.getAllUsers();

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      token: this.generateToken()
    };

    // ⬅️ Save to localStorage (persistent)
    users.push(newUser);
    this.saveAllUsers(users);

    const { password, ...userWithoutPassword } = newUser;

    // ⬅️ Save current user to sessionStorage (temporary)
    sessionStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    this.currentUserSubject.next(userWithoutPassword);

    return {
      success: true,
      message: 'Account created successfully!'
    };
  }

  login(email: string, password: string): { success: boolean; message: string; user?: User } {
    const users = this.getAllUsers();

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return {
        success: false,
        message: 'Email not found. Please check your email or sign up.'
      };
    }

    if (user.password !== password) {
      return {
        success: false,
        message: 'Incorrect password. Please try again.'
      };
    }

    const { password: _, ...userWithoutPassword } = user;

    // ⬅️ Save to sessionStorage (clears on browser close)
    sessionStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    this.currentUserSubject.next(userWithoutPassword);

    return {
      success: true,
      message: 'Login successful!',
      user: userWithoutPassword
    };
  }

  logout(): void {
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  private generateToken(): string {
    return 'token_' + Math.random().toString(36).substr(2, 9);
  }

  getCurrentUser(): User | null {
    return this.currentUserValue;
  }
}