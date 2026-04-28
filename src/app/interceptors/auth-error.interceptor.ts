import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

let redirecting = false;

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError(err => {
      if (err.status === 401) {
        if (!redirecting) {
          redirecting = true;
          auth.clearUser();
          router.navigate(['/login']).then(() => { redirecting = false; });
        }
        return EMPTY;
      }
      return throwError(() => err);
    })
  );
};
