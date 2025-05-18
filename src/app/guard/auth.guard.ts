import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, filter, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.user$.pipe(
    filter((user): user is NonNullable<typeof user> => user !== undefined), 
    take(1),
    map(user => {
      if (user) {
        return true;
      }
      router.navigate(['/login']);
      return false;
    })
  );
};

export const publicGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.user$.pipe(
    filter((user): user is NonNullable<typeof user> => user !== undefined),
    take(1),
    map(user => {
      if (!user) {
        return true;
      }
      router.navigate(['/profile']);
      return false;
    })
  );
};
