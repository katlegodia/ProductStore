import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  email: string;
  firstName: string;
  Surname: string;
  phoneNumber: string;
  country: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check if user is logged in on service initialization
    this.checkLoginStatus();
  }

  private checkLoginStatus(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      this.currentUserSubject.next(user);
      this.isLoggedInSubject.next(true);
    }
  }

  login(email: string, password: string): Observable<{ success: boolean; message: string; user?: User }> {
    return new Observable(observer => {
      // Simulate API call delay
      setTimeout(() => {
        // Get existing users from localStorage
        const users = this.getStoredUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
          const userData: User = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            Surname: user.Surname,
            phoneNumber: user.phoneNumber,
            country: user.country
          };

          // Store user data in localStorage
          localStorage.setItem('currentUser', JSON.stringify(userData));
          
          // Update subjects
          this.currentUserSubject.next(userData);
          this.isLoggedInSubject.next(true);

          observer.next({ success: true, message: 'Login successful', user: userData });
        } else {
          observer.next({ success: false, message: 'Invalid email or password' });
        }
        observer.complete();
      }, 1000);
    });
  }

  register(firstName: string, Surname: string, email: string, password: string, phoneNumber: string, country: string): Observable<{ success: boolean; message: string }> {
    return new Observable(observer => {
      // Simulate API call delay
      setTimeout(() => {
        const users = this.getStoredUsers();
        
        // Check if user already exists
        if (users.find(u => u.email === email)) {
          observer.next({ success: false, message: 'User already exists with this email' });
          observer.complete();
          return;
        }

        // Create new user
        const newUser = {
          id: Date.now().toString(),
          firstName,
          Surname,
          email,
          password,
          phoneNumber,
          country
        };

        // Add to users array and save
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        observer.next({ success: true, message: 'Registration successful' });
        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private getStoredUsers(): any[] {
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers) : [];
  }
}