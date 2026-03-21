import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderDetailsComponent } from './order-details/order-details.component';

import { authGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: OrderHistoryComponent, canActivate: [authGuard] },
  { path: ':id', component: OrderDetailsComponent, canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
