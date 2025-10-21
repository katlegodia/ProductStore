import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../cart/cart.service';
import { CheckoutService } from './checkout.service';

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: 'credit-card' | 'debit-card' | 'eft';
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css'],
})
export class CheckoutComponent implements OnInit {
  cart: any[] = [];
  customerInfo: CustomerInfo = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'credit-card'
  };
  
  isProcessing: boolean = false;
  orderPlaced: boolean = false;
  notification: string = '';
  showNotification: boolean = false;

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cart = this.cartService.getCart();
    if (this.cart.length === 0) {
      this.router.navigate(['/cart']);
    }
  }

  get totalCost(): number {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  get totalItems(): number {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  onSubmit() {
    if (this.validateForm()) {
      this.isProcessing = true;
      
      const orderData = {
        items: this.cart,
        customerInfo: this.customerInfo,
        totalAmount: this.totalCost,
        orderDate: new Date()
      };

      this.checkoutService.processOrder(orderData).subscribe({
        next: (response: any) => {
          this.isProcessing = false;
          this.orderPlaced = true;
          this.showPopup('Order placed successfully!');
          // Clear cart after successful order
          this.cartService.clearCart();
          
          // Redirect to products page after 3 seconds
          setTimeout(() => {
            this.router.navigate(['/products']);
          }, 3000);
        },
        error: (error: any) => {
          this.isProcessing = false;
          this.showPopup('Error processing order. Please try again.');
          console.error('Order processing error:', error);
        }
      });
    }
  }

  validateForm(): boolean {
    const { firstName, lastName, email, phone, address, city, postalCode } = this.customerInfo;
    
    if (!firstName || !lastName || !email || !phone || !address || !city || !postalCode) {
      this.showPopup('Please fill in all required fields.');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.showPopup('Please enter a valid email address.');
      return false;
    }

    // Basic phone validation (South African format)
    const phoneRegex = /^(\+27|0)[0-9]{9}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      this.showPopup('Please enter a valid phone number.');
      return false;
    }

    return true;
  }

  showPopup(message: string) {
    this.notification = message;
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }

  goBack() {
    this.router.navigate(['/cart']);
  }
}