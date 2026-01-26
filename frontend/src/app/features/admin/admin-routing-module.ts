import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { AdminProductsComponent } from './admin-products/admin-products';
import { AdminBlogsComponent } from './admin-blogs/admin-blogs';
import { AdminCareersComponent } from './admin-careers/admin-careers';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'products', component: AdminProductsComponent },
  { path: 'blogs', component: AdminBlogsComponent },
  { path: 'careers', component: AdminCareersComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
