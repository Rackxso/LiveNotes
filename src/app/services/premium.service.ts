import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, EMPTY, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

interface ToggleResponse    { permisos: number; isPremium: boolean; }
interface CheckoutResponse  { url: string; }
interface PortalResponse    { url: string; }

@Injectable({ providedIn: 'root' })
export class PremiumService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly base = `${environment.apiUrl}/stripe`;

  createCheckoutSession(): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(`${this.base}/create-checkout-session`, {});
  }

  createPortalSession(): Observable<PortalResponse> {
    return this.http.post<PortalResponse>(`${this.base}/create-portal-session`, {});
  }

  simulateToggle(): Observable<ToggleResponse> {
    if (!this.auth.user()) return EMPTY;
    return this.http.post<ToggleResponse>(`${this.base}/simulate-toggle`, {}).pipe(
      tap(res => this.auth.updatePermisos(res.permisos))
    );
  }
}
