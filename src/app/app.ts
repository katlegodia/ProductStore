import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NgForOf, CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgForOf, CurrencyPipe],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  protected title = signal('angular-app');
  products: any[] = [];
  cart: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.http.get<any[]>('https://fakestoreapi.com/products')
      .subscribe(data => {
        this.products = data;
      });
  }

  addToCart(product: any) {
    const item = this.cart.find(p => p.id === product.id);
    if (item) {
      item.quantity += 1;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
  }

  viewDetails(product: any) {
    this.router.navigate(['/product', product.id]);
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
