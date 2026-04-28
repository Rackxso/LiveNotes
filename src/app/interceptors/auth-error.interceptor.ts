import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpBackend, HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, EMPTY, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

let refreshing = false;

function doRefresh(req: HttpRequest<unknown>, next: HttpHandlerFn, auth: AuthService, router: Router, backend: HttpBackend) {
  const refreshToken = auth.getRefreshToken();
  if (!refreshToken) {
    auth.clearUser();
    router.navigate(['/login']);
    return EMPTY;
  }

  const http = new HttpClient(backend);
  return http.post<{ accessToken: string }>(`${environment.apiUrl}/user/refresh`, { refreshToken }).pipe(
    switchMap(res => {
      refreshing = false;
      auth.setToken(res.accessToken);
      const retried = req.clone({ setHeaders: { Authorization: `Bearer ${res.accessToken}` } });
      return next(retried);
    }),
    catchError(() => {
      refreshing = false;
      auth.clearUser();
      router.navigate(['/login']);
      return EMPTY;
    })
  );
}

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router  = inject(Router);
  const auth    = inject(AuthService);
  const backend = inject(HttpBackend);

  return next(req).pipe(
    catchError(err => {
      if (err.status === 401 && !req.url.includes('/user/refresh') && !req.url.includes('/user/login')) {
        if (!refreshing) {
          refreshing = true;
          return doRefresh(req, next, auth, router, backend);
        }
        return EMPTY;
      }
      return throwError(() => err);
    })
  );
};
