import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  firstName: string;
  lastName: string; // Keep as lastName for consistency with backend
  email: string;
  phoneNumber: string;
  country: string;
  profilePicture?: string; // Optional profile picture URL/base64
  createdAt: Date;
}

export interface LoginCredentials {
  email?: string;
  phoneNumber?: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
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
    this.checkLoginStatus();
  }

  private checkLoginStatus(): void {
    const userData = localStorage.getItem('currentUser');
    const token = localStorage.getItem('authToken');
    
    if (userData && token) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
        this.isLoggedInSubject.next(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.logout();
      }
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return new Observable(observer => {
      // Simulate API call delay
      setTimeout(() => {
        const users = this.getStoredUsers();
        let user = null;

        // Find user by email or phone number
        if (credentials.email) {
          user = users.find(u => u.email === credentials.email && u.password === credentials.password);
        } else if (credentials.phoneNumber) {
          user = users.find(u => u.phoneNumber === credentials.phoneNumber && u.password === credentials.password);
        }

        if (user) {
          const userData: User = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            country: user.country,
            createdAt: new Date(user.createdAt)
          };

          // Generate a simple token
          const token = this.generateToken(userData);
          
          // Store user data and token
          localStorage.setItem('currentUser', JSON.stringify(userData));
          localStorage.setItem('authToken', token);
          
          // Update subjects
          this.currentUserSubject.next(userData);
          this.isLoggedInSubject.next(true);

          observer.next({ 
            success: true, 
            message: `Welcome back, ${userData.firstName}!`, 
            user: userData 
          });
        } else {
          observer.next({ 
            success: false, 
            message: 'Invalid credentials. Please check your email/phone and password.' 
          });
        }
        observer.complete();
      }, 1500);
    });
  }

  register(userData: RegisterData): Observable<AuthResponse> {
    return new Observable(observer => {
      // Simulate API call delay
      setTimeout(() => {
        const users = this.getStoredUsers();
        
        // Check if user already exists by email
        if (users.find(u => u.email === userData.email)) {
          observer.next({ 
            success: false, 
            message: 'An account with this email already exists.' 
          });
          observer.complete();
          return;
        }

        // Check if user already exists by phone number
        if (users.find(u => u.phoneNumber === userData.phoneNumber)) {
          observer.next({ 
            success: false, 
            message: 'An account with this phone number already exists.' 
          });
          observer.complete();
          return;
        }

        // Create new user
        const newUser = {
          id: this.generateId(),
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          country: userData.country,
          password: userData.password, // In production, this should be hashed
          createdAt: new Date().toISOString()
        };

        // Add to users array and save
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        observer.next({ 
          success: true, 
          message: `Account created successfully! Welcome, ${userData.firstName}!` 
        });
        observer.complete();
      }, 1500);
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Get user by email or phone
  getUserByCredentials(email?: string, phoneNumber?: string): any | null {
    const users = this.getStoredUsers();
    if (email) {
      return users.find(u => u.email === email);
    }
    if (phoneNumber) {
      return users.find(u => u.phoneNumber === phoneNumber);
    }
    return null;
  }

  // Update user profile
  updateProfile(updates: Partial<User>): Observable<AuthResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
          observer.next({ success: false, message: 'User not logged in' });
          observer.complete();
          return;
        }

        const users = this.getStoredUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
          // Update user in storage
          users[userIndex] = { ...users[userIndex], ...updates };
          localStorage.setItem('users', JSON.stringify(users));

          // Update current user
          const updatedUser = { ...currentUser, ...updates };
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          this.currentUserSubject.next(updatedUser);

          observer.next({ 
            success: true, 
            message: 'Profile updated successfully!',
            user: updatedUser 
          });
        } else {
          observer.next({ success: false, message: 'User not found' });
        }
        observer.complete();
      }, 1000);
    });
  }

  private getStoredUsers(): any[] {
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers) : [];
  }

  private generateId(): string {
    return 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generateToken(user: User): string {
    // Simple token generation (in production, use JWT or similar)
    const tokenData = {
      userId: user.id,
      email: user.email,
      timestamp: Date.now()
    };
    return btoa(JSON.stringify(tokenData));
  }

  // Validate token
  validateToken(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    try {
      const tokenData = JSON.parse(atob(token));
      // Check if token is not older than 7 days
      const tokenAge = Date.now() - tokenData.timestamp;
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
      
      return tokenAge < maxAge;
    } catch (error) {
      return false;
    }
  }

  // Get all users (for demo purposes - remove in production)
  getAllUsers(): any[] {
    return this.getStoredUsers();
  }

  // Update profile picture
  updateProfilePicture(profilePicture: string): Observable<AuthResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
          observer.next({ success: false, message: 'User not logged in' });
          observer.complete();
          return;
        }

        // Store profile picture separately for better performance
        localStorage.setItem(`profilePic_${currentUser.id}`, profilePicture);

        observer.next({ 
          success: true, 
          message: 'Profile picture updated successfully!' 
        });
        observer.complete();
      }, 500);
    });
  }

  // Get profile picture
  getProfilePicture(userId: string): string | null {
    return localStorage.getItem(`profilePic_${userId}`);
  }

  // Remove profile picture
  removeProfilePicture(userId: string): void {
    localStorage.removeItem(`profilePic_${userId}`);
  }

  // Change password
  changePassword(currentPassword: string, newPassword: string): Observable<AuthResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
          observer.next({ success: false, message: 'User not logged in' });
          observer.complete();
          return;
        }

        const users = this.getStoredUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
          // Verify current password
          if (users[userIndex].password !== currentPassword) {
            observer.next({ success: false, message: 'Current password is incorrect' });
            observer.complete();
            return;
          }

          // Update password
          users[userIndex].password = newPassword;
          localStorage.setItem('users', JSON.stringify(users));

          observer.next({ 
            success: true, 
            message: 'Password changed successfully!' 
          });
        } else {
          observer.next({ success: false, message: 'User not found' });
        }
        observer.complete();
      }, 1000);
    });
  }
}