import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../services/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  profileForm = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    country: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  
  profilePicture: string | null = null;
  selectedFile: File | null = null;
  isEditing = false;
  isLoading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  showPasswordFields = false;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.profileForm = {
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        phoneNumber: this.user.phoneNumber,
        country: this.user.country,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
      
      // Load profile picture from localStorage if exists
      const savedProfilePic = localStorage.getItem(`profilePic_${this.user.id}`);
      if (savedProfilePic) {
        this.profilePicture = savedProfilePic;
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Reset form when canceling edit
      this.loadUserProfile();
      this.showPasswordFields = false;
      this.clearMessages();
    }
  }

  togglePasswordFields(): void {
    this.showPasswordFields = !this.showPasswordFields;
    if (!this.showPasswordFields) {
      this.profileForm.currentPassword = '';
      this.profileForm.newPassword = '';
      this.profileForm.confirmPassword = '';
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.showMessage('Please select a valid image file.', 'error');
        return;
      }
      
      // Validate file size (max 2MB)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        this.showMessage('File size must be less than 2MB.', 'error');
        return;
      }
      
      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profilePicture = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeProfilePicture(): void {
    this.profilePicture = null;
    this.selectedFile = null;
    if (this.user) {
      localStorage.removeItem(`profilePic_${this.user.id}`);
    }
    
    // Reset file input
    const fileInput = document.getElementById('profilePicInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  saveProfile(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.clearMessages();

    // Prepare update data
    const updateData: Partial<User> = {
      firstName: this.profileForm.firstName,
      lastName: this.profileForm.lastName,
      email: this.profileForm.email,
      phoneNumber: this.profileForm.phoneNumber,
      country: this.profileForm.country
    };

    // Update profile
    this.authService.updateProfile(updateData).subscribe({
      next: (response) => {
        if (response.success) {
          // Save profile picture if selected
          if (this.selectedFile && this.user) {
            localStorage.setItem(`profilePic_${this.user.id}`, this.profilePicture || '');
          }
          
          // Update password if provided
          if (this.showPasswordFields && this.profileForm.newPassword) {
            this.updatePassword();
          } else {
            this.showMessage(response.message, 'success');
            this.isEditing = false;
            this.showPasswordFields = false;
            this.user = response.user || this.user;
          }
        } else {
          this.showMessage(response.message, 'error');
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.showMessage('An error occurred while updating your profile.', 'error');
        this.isLoading = false;
      }
    });
  }

  private updatePassword(): void {
    if (!this.user) return;

    // In a real app, this would be a separate API call
    // For now, we'll update the password in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === this.user!.id);
    
    if (userIndex !== -1) {
      // Verify current password
      if (users[userIndex].password !== this.profileForm.currentPassword) {
        this.showMessage('Current password is incorrect.', 'error');
        return;
      }
      
      // Update password
      users[userIndex].password = this.profileForm.newPassword;
      localStorage.setItem('users', JSON.stringify(users));
      
      this.showMessage('Profile and password updated successfully!', 'success');
      this.isEditing = false;
      this.showPasswordFields = false;
      
      // Clear password fields
      this.profileForm.currentPassword = '';
      this.profileForm.newPassword = '';
      this.profileForm.confirmPassword = '';
    }
  }

  private validateForm(): boolean {
    // Basic validation
    if (!this.profileForm.firstName.trim()) {
      this.showMessage('First name is required.', 'error');
      return false;
    }
    
    if (!this.profileForm.lastName.trim()) {
      this.showMessage('Last name is required.', 'error');
      return false;
    }
    
    if (!this.profileForm.email.trim()) {
      this.showMessage('Email is required.', 'error');
      return false;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.profileForm.email)) {
      this.showMessage('Please enter a valid email address.', 'error');
      return false;
    }
    
    if (!this.profileForm.phoneNumber.trim()) {
      this.showMessage('Phone number is required.', 'error');
      return false;
    }
    
    if (!this.profileForm.country.trim()) {
      this.showMessage('Country is required.', 'error');
      return false;
    }
    
    // Password validation if changing password
    if (this.showPasswordFields) {
      if (!this.profileForm.currentPassword) {
        this.showMessage('Current password is required to change password.', 'error');
        return false;
      }
      
      if (!this.profileForm.newPassword) {
        this.showMessage('New password is required.', 'error');
        return false;
      }
      
      if (this.profileForm.newPassword.length < 6) {
        this.showMessage('New password must be at least 6 characters long.', 'error');
        return false;
      }
      
      if (this.profileForm.newPassword !== this.profileForm.confirmPassword) {
        this.showMessage('New passwords do not match.', 'error');
        return false;
      }
    }
    
    return true;
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    
    // Auto-clear success messages after 3 seconds
    if (type === 'success') {
      setTimeout(() => {
        this.clearMessages();
      }, 3000);
    }
  }

  private clearMessages(): void {
    this.message = '';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }

  navigateToCart(): void {
    this.router.navigate(['/cart']);
  }
}