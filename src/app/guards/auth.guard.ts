import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.user$.pipe(
      map((user) => {
        if (user && (state.url === '/login' || state.url === '/register')) {
          this.router.navigate(['/task']);
          return false;
        }
        if (!user && state.url !== '/login' && state.url !== '/register') {
          this.router.navigate(['/register']);
          return false;
        }
        return true;
      })
    );
  }
}
