import { Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { Cart } from './cart/cart';
import { ProductDetails } from './product-details/product-details';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth/auth.guard';


export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'products', component: ProductsComponent, canActivate: [authGuard] },
  { path: 'cart', component: Cart, canActivate: [authGuard] },
  { path: 'product/:id', component: ProductDetails, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent }
];
