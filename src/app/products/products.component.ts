import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgForOf, CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterLink, NgForOf, CurrencyPipe],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  notification: string = '';
  showNotification: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.http.get<any[]>('https://fakestoreapi.com/products')
      .subscribe(data => {
        this.products = data;
      });
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    this.showPopup(`"${product.title}" has been added to your cart!`);
  }

  viewDetails(product: any) {
    console.log("viewDetails called with product:", product);
    
    this.router.navigate(['/product', product.id]);
  }

  showPopup(message: string) {
    this.notification = message;
    this.showNotification = true;
    // Auto-close after 5 seconds
    setTimeout(() => {
      this.showNotification = false;
    }, 5000);
  }

  closePopup() {
    this.showNotification = false;
  }

  goToCart() {
    this.showNotification = false;
    this.router.navigate(['/cart']);
  }
}
