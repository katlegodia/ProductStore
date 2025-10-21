import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cart: any[] = [];

  getCart() {
    return this.cart;
  }

  addToCart(product: any) {
    const item = this.cart.find(p => p.id === product.id);
    if (item) {
      item.quantity += 1;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
  }

  clearCart() {
    this.cart = [];
  }
}