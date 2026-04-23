import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PremiumService } from '../../services/premium.service';
import { ThemeService, Theme } from '../../services/theme.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-settings',
  imports: [FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settings {
  readonly auth    = inject(AuthService);
  readonly premium = inject(PremiumService);
  readonly theme   = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly http   = inject(HttpClient);

  readonly themes: { value: Theme; label: string; icon: string }[] = [
    { value: 'light',  label: 'Claro',   icon: 'fa-solid fa-sun' },
    { value: 'dark',   label: 'Oscuro',  icon: 'fa-solid fa-moon' },
    { value: 'system', label: 'Sistema', icon: 'fa-solid fa-display' },
  ];

  // Plan simulate
  readonly toggling = signal(false);

  // Change password
  readonly showPasswordForm = signal(false);
  readonly oldPassword      = signal('');
  readonly passwordLoading  = signal(false);
  readonly passwordMsg      = signal<{ text: string; ok: boolean } | null>(null);

  simulateToggle(): void {
    if (this.toggling()) return;
    this.toggling.set(true);
    this.premium.simulateToggle().subscribe({
      next:  () => this.toggling.set(false),
      error: () => this.toggling.set(false),
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
