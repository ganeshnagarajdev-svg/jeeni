import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersRoutingModule } from './orders-routing-module';
import { OrderHistoryComponent } from './order-history/order-history.component';

@NgModule({
  imports: [
    CommonModule,
    OrdersRoutingModule,
    OrderHistoryComponent
  ]
})
export class OrdersModule { }
