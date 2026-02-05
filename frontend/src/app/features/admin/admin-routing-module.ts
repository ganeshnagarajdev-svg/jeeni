import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { AdminProductsComponent } from './admin-products/admin-products';
import { AdminBlogsComponent } from './admin-blogs/admin-blogs';
import { AdminCareersComponent } from './admin-careers/admin-careers';
import { AdminPhotosComponent } from './admin-photos/admin-photos';
import { AdminVideosComponent } from './admin-videos/admin-videos';
import { AdminOrdersComponent } from './admin-orders/admin-orders';
import { AdminOrderDetailsComponent } from './admin-orders/admin-order-details';

import { AdminLayoutComponent } from './admin-layout';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'blogs', component: AdminBlogsComponent },
      { path: 'careers', component: AdminCareersComponent },
      { path: 'photos', component: AdminPhotosComponent },

      { path: 'videos', component: AdminVideosComponent },
      { path: 'orders', component: AdminOrdersComponent },
      { path: 'orders/:id', component: AdminOrderDetailsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

