import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WishlistListComponent } from './wishlist-list/wishlist-list';

const routes: Routes = [
  { path: '', component: WishlistListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WishlistRoutingModule { }
