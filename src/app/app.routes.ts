import { Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { Cart } from './cart/cart';
import { ProductDetails } from './product-details/product-details';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth.guard';
import { CheckoutComponent } from './checkout/checkout';



export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'products', component: ProductsComponent, canActivate: [authGuard] },
  { path: 'cart', component: Cart, canActivate: [authGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
  { path: 'product/:id', component: ProductDetails, canActivate: [authGuard] },
];
