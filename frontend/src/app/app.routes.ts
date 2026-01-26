import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'shop',
    loadChildren: () => import('./features/shop/shop-module').then(m => m.ShopModule)
  },
  {
    path: 'wishlist',
    loadChildren: () => import('./features/wishlist/wishlist-module').then(m => m.WishlistModule)
  },
  {
    path: 'content',
    loadChildren: () => import('./features/content/content-module').then(m => m.ContentModule)
  },
  {
    path: 'general',
    loadChildren: () => import('./features/general/general-module').then(m => m.GeneralModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin-module').then(m => m.AdminModule)
  },
  {
    path: '',
    redirectTo: 'general',
    pathMatch: 'full'
  }
];

