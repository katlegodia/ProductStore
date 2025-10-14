import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CurrencyPipe } from '@angular/common'; // <-- Add this
import { AppServices } from '../app.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CurrencyPipe], // <-- Add CurrencyPipe here
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css']
})
export class ProductDetails implements OnInit {
  
  product: any;
  public title: any;
  public description: any;
  public price: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.getProductById();
  }

  ngOnInit() {
    // console.log('Product ID from route inside ngonit:', id);
    
      
  }

  getProductById(){    
    const id = this.route.snapshot.paramMap.get('id');

    let data = this.http.get('https://fakestoreapi.com/products/' + id);
    data.subscribe((result:any)=>{
      this.product = result;
      this.title = this.product.title;
      this.description = this.product.description;
      this.price = this.product.price;
      console.log("Product Data:", this.product);
      
    });
    

  }
}