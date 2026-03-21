import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, skipWhile, take } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  return authService.isLoading$.pipe(
    skipWhile(loading => loading === true),
    take(1),
    map(() => authService.isAuthenticated()),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      }

      // If not authenticated, redirect to login with returnUrl
      toastService.info('Please log in to continue');
      router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    })
  );
};
