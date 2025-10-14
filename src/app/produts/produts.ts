import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common'; // <-- Add this

@Component({
  selector: 'app-produts',
  standalone: true, // <-- Add this
  imports: [CurrencyPipe], // <-- Add this
  templateUrl: './produts.html',
  styleUrls: ['./produts.css']
})
export class Produts {

  fakeData = [
    {
      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
      title: 'Product Name', // <-- Only the name here
      price: 100
    },
    {
      image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
      title: 'Product Name 2', // <-- Only the name here
      price: 200
    }
    // Add more products as needed
  ];

  viewDetails(product: any) {
    // Implement navigation to details page here
}

notification: string = '';
showNotification: boolean = false;

addToCart(product: any) {
  // Add your cart logic here (e.g., push to cart array)
  this.showPopup('Added to cart!');
}

showPopup(message: string) {
  this.notification = message;
  this.showNotification = true;
  setTimeout(() => {
    this.showNotification = false;
  }, 1500);
}
}