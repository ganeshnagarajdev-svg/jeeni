import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartRoutingModule } from './cart-routing-module';
import { CartListComponent } from './cart-list/cart-list.component';
import { CheckoutComponent } from './checkout/checkout.component';

@NgModule({
  imports: [
    CommonModule,
    CartRoutingModule,
    CartListComponent,
    CheckoutComponent
  ]
})
export class CartModule { }
