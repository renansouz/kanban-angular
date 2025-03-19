import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';
import { Observable } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return new Observable (subscriber => {
    auth.onAuthStateChanged(user => {
      if (user) {
        subscriber.next(true);
      } else {
        router.navigate(['/login']);
        subscriber.next(false);
      }
    });
  });
};
