import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, EMPTY, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

interface ToggleResponse { permisos: number; isPremium: boolean; }

// [STRIPE] Descomenta cuando Stripe esté activo
// interface CheckoutResponse { url: string; }

@Injectable({ providedIn: 'root' })
export class PremiumService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly base = `${environment.apiUrl}/stripe`;

  // [STRIPE] Descomenta cuando Stripe esté activo
  // createCheckoutSession(): void {
  //   this.http.post<CheckoutResponse>(`${this.base}/create-checkout-session`, {}).subscribe(res => {
  //     window.location.href = res.url;
  //   });
  // }

  simulateToggle(): Observable<ToggleResponse> {
    if (!this.auth.user()) return EMPTY;
    return this.http.post<ToggleResponse>(`${this.base}/simulate-toggle`, {}).pipe(
      tap(res => this.auth.updatePermisos(res.permisos))
    );
  }
}
