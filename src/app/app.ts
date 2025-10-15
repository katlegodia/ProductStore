import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NgForOf, CurrencyPipe, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService, User } from './auth/auth.service';
import { CartService } from './cart/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgForOf, CurrencyPipe, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  protected title = signal('angular-app');
  products: any[] = [];
  cart: any[] = [];
  isLoggedIn = false;
  currentUser: User | null = null;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.http.get<any[]>('https://fakestoreapi.com/products')
      .subscribe(data => {
        this.products = data;
      });

    // Subscribe to authentication state
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    this.showPopup('Item added to cart!');
  }

  viewDetails(product: any) {
    this.router.navigate(['/product', product.id]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.showPopup('Logged out successfully!');
  }

  notification: string = '';
  showNotification: boolean = false;

  showPopup(message: string) {
    this.notification = message;
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 1500);
  }
}
