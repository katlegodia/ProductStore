import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from './cart.service';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, CurrencyPipe, RouterLink],
    templateUrl: './cart.html',
    styleUrls: ['./cart.css'],
})
export class Cart implements OnInit {
    cart: any[] = [];
    notification: string = '';
    showNotification: boolean = false;

    constructor(private cartService: CartService) {}

    ngOnInit() {
        this.cart = this.cartService.getCart();
    }

    add(product: any) {
        this.cartService.addToCart(product);
        this.showPopup('Item added to cart!');
    }

    subtract(product: any) {
        if (product.quantity > 1) {
            product.quantity -= 1;
            this.showPopup('Item removed from cart!');
        }
    }

    remove(item: any) {
        const index = this.cart.indexOf(item);
        if (index > -1) {
            this.cart.splice(index, 1);
            this.showPopup('Item removed from cart!');
        }
    }

    showPopup(message: string) {
        this.notification = message;
        this.showNotification = true;
        setTimeout(() => {
            this.showNotification = false;
        }, 1500);
    }

    get totalCost(): number {
        return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
}