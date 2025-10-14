import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgForOf } from '@angular/common';
import { HttpClient } from '@angular/common/http';

// filepath: c:\Users\Katlego Diatshwana\angular-app\src\app\products\products.ts
@Component({
  selector: 'app-products',
  imports: [RouterOutlet, NgForOf],
  templateUrl: './products.html'
  // styleUrls: ['./app.css'] <-- remove this line
})
export class Products  implements OnInit {
  protected title = signal('angular-app');
  products: any[] = [];

  constructor(private http: HttpClient) {}

  cart: any[] = [];

  addToCart(product: any) {
  const item = this.cart.find((p: any) => p.id === product.id);
  if (item) {
    item.quantity += 1;
  } else {
    this.cart.push({ ...product, quantity: 1 });
  }
  this.showPopup('Added to cart!');
}
  showPopup(arg0: string) {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
    this.http.get<any[]>('https://fakestoreapi.com/products')
      .subscribe(data => {
        this.products = data;
      });
  }
}
