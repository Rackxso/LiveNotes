import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';

export type ViewMode = 'admin' | 'free' | 'premium';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly auth = inject(AuthService);

  private readonly _viewMode = signal<ViewMode>('admin');
  readonly viewMode = this._viewMode.asReadonly();
  readonly showAdminUI = computed(() => this._viewMode() === 'admin');

  private originalPermisos: number | null = null;

  setViewMode(mode: ViewMode): void {
    if (this._viewMode() === 'admin' && mode !== 'admin') {
      this.originalPermisos = this.auth.user()?.permisos ?? 13579;
    }
    this._viewMode.set(mode);
    const permisosMap: Record<ViewMode, number> = {
      admin:   this.originalPermisos ?? 13579,
      free:    1,
      premium: 2,
    };
    this.auth.updatePermisosTemporary(permisosMap[mode]);
    if (mode === 'admin') this.originalPermisos = null;
  }
}
