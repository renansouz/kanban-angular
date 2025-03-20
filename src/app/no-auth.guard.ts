import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return new Observable<boolean>((subscriber) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        router.navigate(['/dashboard']); // Redirect logged-in users to dashboard
        subscriber.next(false);
      } else {
        subscriber.next(true); // Allow access if NOT logged in
      }
      subscriber.complete();
    });
  }).pipe(take(1));
};
