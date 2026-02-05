import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, skipWhile, take } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If there's a token but no user yet, wait for loading to finish
  return authService.isLoading$.pipe(
    skipWhile(loading => loading === true),
    take(1),
    map(() => authService.currentUserValue),
    map(user => {
      // Check if user is logged in and has admin role
      if (user && user.role === 'admin') {
        return true;
      }

      // If not admin, redirect to login or home
      // Removing alert for better UX, could use a Toast service here
      router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    })
  );
};
