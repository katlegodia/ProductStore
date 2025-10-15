import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  activeTab: 'login' | 'register' = 'login';
  loading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  // Country list for dropdown
  countries = [
    { code: 'ZA', name: 'South Africa', phoneCode: '+27' }
  ];

  // Login form data
  loginData = {
    email: '',
    password: ''
  };

  // Register form data
  registerData = {
    firstName: '',
    Surname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    country: 'ZA' // Default to South Africa
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // If user is already logged in, redirect to products page
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/products']);
    }
  }

  switchTab(tab: 'login' | 'register'): void {
    this.activeTab = tab;
    this.clearMessage();
  }

  onLogin(): void {
    if (!this.loginData.email || !this.loginData.password) {
      this.showMessage('Please fill in all fields', 'error');
      return;
    }

    // Validate email format for login as well
    if (!this.isValidEmail(this.loginData.email)) {
      this.showMessage('Incorrect email', 'error');
      return;
    }

    this.loading = true;
    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.showMessage(response.message, 'success');
          // Redirect to products page after successful login
          setTimeout(() => {
            this.router.navigate(['/products']);
          }, 1000);
        } else {
          this.showMessage(response.message, 'error');
        }
      },
      error: (error) => {
        this.loading = false;
        this.showMessage('An error occurred during login', 'error');
        console.error('Login error:', error);
      }
    });
  }

  onRegister(): void {
    if (!this.registerData.firstName || !this.registerData.Surname || 
        !this.registerData.email || !this.registerData.password || 
        !this.registerData.confirmPassword || !this.registerData.phoneNumber ||
        !this.registerData.country) {
      this.showMessage('Please fill in all fields', 'error');
      return;
    }

    // Validate email format
    if (!this.isValidEmail(this.registerData.email)) {
      this.showMessage('Incorrect email', 'error');
      return;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.showMessage('Passwords do not match', 'error');
      return;
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordPattern.test(this.registerData.password)) {
      this.showMessage('Password requires a upper case letter, a lower case letter, a number, and a special character', 'error');
      return;
    }

    if (this.registerData.password.length < 6) {
      this.showMessage('Password must be at least 6 characters long', 'error');
      return;
    }

    // Validate phone number based on selected country
    if (!this.isValidPhoneNumber(this.registerData.phoneNumber, this.registerData.country)) {
      this.showMessage(this.getPhoneValidationMessage(this.registerData.country), 'error');
      return;
    }

    this.loading = true;
    this.authService.register(
      this.registerData.firstName,
      this.registerData.Surname,
      this.registerData.email,
      this.registerData.password,
      this.formatPhoneNumber(this.registerData.phoneNumber, this.registerData.country),
      this.registerData.country
    ).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.showMessage(response.message, 'success');
          // Switch to login tab after successful registration
          setTimeout(() => {
            this.switchTab('login');
            this.resetForms();
          }, 1500);
        } else {
          this.showMessage(response.message, 'error');
        }
      },
      error: (error) => {
        this.loading = false;
        this.showMessage('An error occurred during registration', 'error');
        console.error('Registration error:', error);
      }
    });
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
  }

  private clearMessage(): void {
    this.message = '';
  }

  private resetForms(): void {
    this.loginData = { email: '', password: '' };
    this.registerData = { firstName: '', Surname: '', email: '', password: '', confirmPassword: '', phoneNumber: '', country: 'ZA' };
  }

  // Email validation method
  private isValidEmail(email: string): boolean {
    // Check if email contains @ symbol
    if (!email.includes('@')) {
      return false;
    }
    
    // Comprehensive email validation pattern
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  // Phone number validation methods
  private isValidPhoneNumber(phoneNumber: string, countryCode: string): boolean {
    // Remove all non-digit characters
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Only validate South African numbers: exactly 10 digits
    return /^[0-9]{10}$/.test(cleanNumber);
  }

  private getPhoneValidationMessage(countryCode: string): string {
    return 'South African phone numbers must be exactly 10 digits (e.g., 0123456789)';
  }

  private formatPhoneNumber(phoneNumber: string, countryCode: string): string {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    return `+27${cleanNumber}`;
  }

  getSelectedCountry(): any {
    return this.countries.find(c => c.code === this.registerData.country);
  }
}