import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface OrderItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

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

export interface Order {
  items: OrderItem[];
  customerInfo: CustomerInfo;
  totalAmount: number;
  orderDate: Date;
}

export interface OrderResponse {
  orderId: string;
  status: 'success' | 'failed';
  message: string;
  estimatedDelivery?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private orders: Order[] = [];

  constructor() {}

  processOrder(orderData: Order): Observable<OrderResponse> {
    // Simulate order processing with a delay
    return new Observable<OrderResponse>(observer => {
      setTimeout(() => {
        // Simulate random success/failure (90% success rate)
        const isSuccess = Math.random() > 0.1;
        
        if (isSuccess) {
          const orderId = this.generateOrderId();
          const estimatedDelivery = new Date();
          estimatedDelivery.setDate(estimatedDelivery.getDate() + 3); // 3 days from now
          
          // Store the order
          this.orders.push({
            ...orderData,
            orderDate: new Date()
          });
          
          const response: OrderResponse = {
            orderId,
            status: 'success',
            message: 'Order processed successfully',
            estimatedDelivery
          };
          
          observer.next(response);
          observer.complete();
        } else {
          observer.error({
            status: 'failed',
            message: 'Payment processing failed. Please check your payment details and try again.'
          });
        }
      }, 2000); // 2 second delay to simulate processing
    });
  }

  private generateOrderId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
  }

  getOrderHistory(): Order[] {
    return [...this.orders];
  }

  validatePaymentMethod(paymentMethod: string): boolean {
    const validMethods = ['credit-card', 'debit-card', 'eft'];
    return validMethods.includes(paymentMethod);
  }

  calculateShipping(totalAmount: number): number {
    // Free shipping for orders over R500
    return totalAmount >= 500 ? 0 : 50;
  }

  validateCustomerInfo(customerInfo: CustomerInfo): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!customerInfo.firstName?.trim()) {
      errors.push('First name is required');
    }

    if (!customerInfo.lastName?.trim()) {
      errors.push('Last name is required');
    }

    if (!customerInfo.email?.trim()) {
      errors.push('Email is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerInfo.email)) {
        errors.push('Invalid email format');
      }
    }

    if (!customerInfo.phone?.trim()) {
      errors.push('Phone number is required');
    } else {
      const phoneRegex = /^(\+27|0)[0-9]{9}$/;
      if (!phoneRegex.test(customerInfo.phone.replace(/\s/g, ''))) {
        errors.push('Invalid phone number format');
      }
    }

    if (!customerInfo.address?.trim()) {
      errors.push('Address is required');
    }

    if (!customerInfo.city?.trim()) {
      errors.push('City is required');
    }

    if (!customerInfo.postalCode?.trim()) {
      errors.push('Postal code is required');
    }

    if (!this.validatePaymentMethod(customerInfo.paymentMethod)) {
      errors.push('Invalid payment method');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}