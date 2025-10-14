import { Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { Cart } from './cart/cart';
import { ProductDetails } from './product-details/product-details';


export const routes: Routes = [
  { path: '', component: ProductsComponent },
  { path: 'cart', component: Cart },
  { path: 'product/:id', component: ProductDetails }
];
