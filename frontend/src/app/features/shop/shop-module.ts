import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ShopRoutingModule } from './shop-routing-module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';


@NgModule({
  imports: [
    CommonModule,
    ShopRoutingModule,
    HttpClientModule,
    ProductListComponent,
    ProductDetailsComponent
  ]
})
export class ShopModule { }
