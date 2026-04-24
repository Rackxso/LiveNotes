import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ThemeService, Theme } from '../../services/theme.service';
import { I18nService } from '../../services/i18n.service';
import { PremiumService } from '../../services/premium.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-settings',
  imports: [FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settings implements OnInit {
  readonly auth    = inject(AuthService);
  readonly theme   = inject(ThemeService);
  readonly i18n    = inject(I18nService);
  private readonly premium = inject(PremiumService);
  private readonly router  = inject(Router);
  private readonly route   = inject(ActivatedRoute);
  private readonly http    = inject(HttpClient);

  readonly themes: { value: Theme; label: string; icon: string }[] = [
    { value: 'light',  label: 'Claro',   icon: 'fa-solid fa-sun' },
    { value: 'dark',   label: 'Oscuro',  icon: 'fa-solid fa-moon' },
    { value: 'system', label: 'Sistema', icon: 'fa-solid fa-display' },
  ];

  // Stripe
  readonly upgradeLoading  = signal(false);
  readonly portalLoading   = signal(false);
  readonly simulateLoading = signal(false);
  readonly planMsg         = signal<{ text: string; ok: boolean } | null>(null);

  // Change password
  readonly showPasswordForm = signal(false);
  readonly oldPassword      = signal('');
  readonly passwordLoading  = signal(false);
  readonly passwordMsg      = signal<{ text: string; ok: boolean } | null>(null);

  readonly isDev = !environment.production;

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    if (params.has('upgraded')) {
      this.planMsg.set({ text: '¡Bienvenido a Premium! Tu cuenta ya está activada.', ok: true });
      this.router.navigate([], { queryParams: {}, replaceUrl: true });
    } else if (params.has('cancelled')) {
      this.planMsg.set({ text: 'Pago cancelado. Puedes intentarlo de nuevo cuando quieras.', ok: false });
      this.router.navigate([], { queryParams: {}, replaceUrl: true });
    }
  }

  upgrade(): void {
    if (this.upgradeLoading()) return;
    this.upgradeLoading.set(true);
    this.planMsg.set(null);
    this.premium.createCheckoutSession().subscribe({
      next: (res) => { window.location.href = res.url; },
      error: (err) => {
        this.upgradeLoading.set(false);
        this.planMsg.set({ text: err.error?.message ?? 'Error al iniciar el pago.', ok: false });
      },
    });
  }

  manageSubscription(): void {
    if (this.portalLoading()) return;
    this.portalLoading.set(true);
    this.planMsg.set(null);
    this.premium.createPortalSession().subscribe({
      next: (res) => { window.location.href = res.url; },
      error: (err) => {
        this.portalLoading.set(false);
        this.planMsg.set({ text: err.error?.message ?? 'Error al abrir el portal de facturación.', ok: false });
      },
    });
  }

  simulateToggle(): void {
    if (this.simulateLoading()) return;
    this.simulateLoading.set(true);
    this.premium.simulateToggle().subscribe({
      next: () => this.simulateLoading.set(false),
      error: () => this.simulateLoading.set(false),
    });
  }

  requestPasswordChange(): void {
    const email = this.auth.user()?.email;
    if (!email || !this.oldPassword() || this.passwordLoading()) return;
    this.passwordLoading.set(true);
    this.passwordMsg.set(null);
    this.http.put(`${environment.apiUrl}/user/${email}/password`, { oldPassword: this.oldPassword() }).subscribe({
      next: () => {
        this.passwordLoading.set(false);
        this.passwordMsg.set({ text: 'Revisa tu email para confirmar el cambio.', ok: true });
        this.oldPassword.set('');
        this.showPasswordForm.set(false);
      },
      error: (err) => {
        this.passwordLoading.set(false);
        this.passwordMsg.set({ text: err.error?.message ?? 'Error al solicitar el cambio.', ok: false });
      },
    });
  }

  logout(): void {
    this.auth.logout().subscribe({
      next:  () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }
}
