import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, LoginCredentials, RegisterData } from '../services/auth.service';

interface Country {
  code: string;
  name: string;
  flag: string;
  phoneCode: string;
}

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
  returnUrl = '/products';

  // Countries list with top countries from each continent
  countries: Country[] = [
    // Africa
    { code: 'ZA', name: 'South Africa', flag: '🇿🇦', phoneCode: '+27' },
    { code: 'BW', name: 'Botswana', flag: '🇧🇼', phoneCode: '+267' },
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬', phoneCode: '+234' },
    { code: 'EG', name: 'Egypt', flag: '🇪🇬', phoneCode: '+20' },
    { code: 'KE', name: 'Kenya', flag: '🇰🇪', phoneCode: '+254' },
    { code: 'GH', name: 'Ghana', flag: '🇬🇭', phoneCode: '+233' },
    
    // North America
    { code: 'US', name: 'United States', flag: '🇺🇸', phoneCode: '+1' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', phoneCode: '+1' },
    
    // Europe
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', phoneCode: '+44' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', phoneCode: '+49' },
    { code: 'FR', name: 'France', flag: '🇫🇷', phoneCode: '+33' },
    
    // Asia
    { code: 'CN', name: 'China', flag: '🇨🇳', phoneCode: '+86' },
    { code: 'IN', name: 'India', flag: '🇮🇳', phoneCode: '+91' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵', phoneCode: '+81' },
    
    // South America
    { code: 'BR', name: 'Brazil', flag: '🇧🇷', phoneCode: '+55' },
    { code: 'AR', name: 'Argentina', flag: '🇦🇷', phoneCode: '+54' },
    
    // Oceania
    { code: 'AU', name: 'Australia', flag: '🇦🇺', phoneCode: '+61' }
  ];

  // Login form data
  loginData = {
    email: '',
    phoneNumber: '',
    password: ''
  };

  // Registration form data
  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    country: 'ZA', // Default to South Africa
    password: '',
    confirmPassword: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get return URL from query params or default to products
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/products';
    
    // If user is already logged in, redirect to return URL
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  switchTab(tab: 'login' | 'register'): void {
    this.activeTab = tab;
    this.clearMessage();
    this.clearForms();
  }

  onLogin(): void {
    if (!this.validateLoginForm()) {
      return;
    }

    this.loading = true;
    
    // Prepare login credentials
    const credentials: LoginCredentials = {
      password: this.loginData.password
    };

    // Add email or phone number based on what user entered
    if (this.loginData.email) {
      credentials.email = this.loginData.email;
    } else if (this.loginData.phoneNumber) {
      credentials.phoneNumber = this.loginData.phoneNumber;
    }

    // Call authentication service
    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.showMessage(response.message, 'success');
          
          // Redirect to return URL after successful login
          setTimeout(() => {
            this.router.navigate([this.returnUrl]);
          }, 1000);
        } else {
          this.showMessage(response.message, 'error');
        }
      },
      error: (error) => {
        this.loading = false;
        this.showMessage('An error occurred during login. Please try again.', 'error');
        console.error('Login error:', error);
      }
    });
  }

  onRegister(): void {
    if (!this.validateRegisterForm()) {
      return;
    }

    this.loading = true;
    
    // Prepare registration data
    const registerData: RegisterData = {
      firstName: this.registerData.firstName,
      lastName: this.registerData.lastName,
      email: this.registerData.email,
      phoneNumber: this.registerData.phoneNumber,
      country: this.registerData.country,
      password: this.registerData.password
    };

    // Call authentication service
    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.showMessage(response.message, 'success');
          
          // Switch to login tab after successful registration
          setTimeout(() => {
            this.switchTab('login');
            // Pre-fill email in login form
            this.loginData.email = this.registerData.email;
          }, 1500);
        } else {
          this.showMessage(response.message, 'error');
        }
      },
      error: (error) => {
        this.loading = false;
        this.showMessage('An error occurred during registration. Please try again.', 'error');
        console.error('Registration error:', error);
      }
    });
  }

  private validateLoginForm(): boolean {
    const { email, phoneNumber, password } = this.loginData;

    if (!email && !phoneNumber) {
      this.showMessage('Please enter either email or phone number', 'error');
      return false;
    }

    if (email && !this.isValidEmail(email)) {
      this.showMessage('Please enter a valid email address', 'error');
      return false;
    }

    if (phoneNumber && !this.isValidPhoneNumber(phoneNumber)) {
      this.showMessage('Please enter a valid South African phone number (10 digits)', 'error');
      return false;
    }

    if (!password) {
      this.showMessage('Please enter your password', 'error');
      return false;
    }

    return true;
  }

  private validateRegisterForm(): boolean {
    const { firstName, lastName, email, phoneNumber, country, password, confirmPassword } = this.registerData;

    if (!firstName || !lastName || !email || !phoneNumber || !country || !password || !confirmPassword) {
      this.showMessage('Please fill in all fields', 'error');
      return false;
    }

    if (!this.isValidEmail(email)) {
      this.showMessage('Please enter a valid email address', 'error');
      return false;
    }

    if (!this.isValidPhoneNumber(phoneNumber)) {
      this.showMessage('Please enter a valid phone number (10 digits for South Africa)', 'error');
      return false;
    }

    // Enhanced password validation
    const passwordValidation = this.validatePassword(password);
    if (!passwordValidation.isValid) {
      this.showMessage(passwordValidation.message, 'error');
      return false;
    }

    if (password !== confirmPassword) {
      this.showMessage('Passwords do not match', 'error');
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  private isValidPhoneNumber(phoneNumber: string): boolean {
    // Remove all non-digit characters
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // For South African numbers: exactly 10 digits
    if (this.registerData.country === 'ZA' || !this.registerData.country) {
      return /^[0-9]{10}$/.test(cleanNumber);
    }
    
    // For other countries, allow 7-15 digits
    return /^[0-9]{7,15}$/.test(cleanNumber);
  }

  private validatePassword(password: string): { isValid: boolean; message: string } {
    // Check minimum length
    if (password.length < 8) {
      return {
        isValid: false,
        message: 'Password must be at least 8 characters long'
      };
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least one uppercase letter (A-Z)'
      };
    }

    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least one lowercase letter (a-z)'
      };
    }

    // Check for number
    if (!/[0-9]/.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least one number (0-9)'
      };
    }

    // Check for special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)'
      };
    }

    return {
      isValid: true,
      message: 'Password is valid'
    };
  }

  getPasswordStrength(password: string): { strength: string; percentage: number; requirements: any } {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    const metRequirements = Object.values(requirements).filter(Boolean).length;
    const totalRequirements = 5;
    const percentage = (metRequirements / totalRequirements) * 100;

    let strength = 'Very Weak';
    if (metRequirements === 5) strength = 'Very Strong';
    else if (metRequirements === 4) strength = 'Strong';
    else if (metRequirements === 3) strength = 'Medium';
    else if (metRequirements === 2) strength = 'Weak';

    return { strength, percentage, requirements };
  }

  getPasswordStrengthColor(strength: string): string {
    switch (strength) {
      case 'Very Strong': return '#28a745';
      case 'Strong': return '#28a745';
      case 'Medium': return '#ffc107';
      case 'Weak': return '#fd7e14';
      default: return '#dc3545';
    }
  }

  isRegistrationFormValid(): boolean {
    const { firstName, lastName, email, phoneNumber, password, confirmPassword } = this.registerData;
    
    // Check if all fields are filled
    if (!firstName || !lastName || !email || !phoneNumber || !password || !confirmPassword) {
      return false;
    }

    // Check email validity
    if (!this.isValidEmail(email)) {
      return false;
    }

    // Check phone number validity
    if (!this.isValidPhoneNumber(phoneNumber)) {
      return false;
    }

    // Check password strength
    const passwordValidation = this.validatePassword(password);
    if (!passwordValidation.isValid) {
      return false;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return false;
    }

    return true;
  }

  onPhoneNumberInput(event: any): void {
    let value = event.target.value;
    
    // Remove all non-digit characters
    value = value.replace(/\D/g, '');
    
    // For South African numbers, limit to 10 digits
    if (this.registerData.country === 'ZA' || this.activeTab === 'login') {
      if (value.length > 10) {
        value = value.substring(0, 10);
      }
    } else {
      // For other countries, limit to 15 digits
      if (value.length > 15) {
        value = value.substring(0, 15);
      }
    }
    
    // Update the appropriate model
    if (this.activeTab === 'login') {
      this.loginData.phoneNumber = value;
    } else {
      this.registerData.phoneNumber = value;
    }
    
    // Update the input value
    event.target.value = value;
  }

  getSelectedCountry(): Country {
    return this.countries.find(c => c.code === this.registerData.country) || this.countries[0];
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    
    // Auto-clear message after 5 seconds
    setTimeout(() => {
      this.clearMessage();
    }, 5000);
  }

  private clearMessage(): void {
    this.message = '';
  }

  private clearForms(): void {
    this.loginData = { email: '', phoneNumber: '', password: '' };
    this.registerData = { 
      firstName: '', 
      lastName: '', 
      email: '', 
      phoneNumber: '', 
      country: 'ZA', 
      password: '', 
      confirmPassword: '' 
    };
  }
}