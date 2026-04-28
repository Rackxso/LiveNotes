import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { FinanceService } from './finance.service';

export interface AuthUser {
  email: string;
  name: string;
  permisos: number;
}

interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

const STORAGE_KEY   = 'ln_user';
const TOKEN_KEY     = 'ln_token';
const REFRESH_KEY   = 'ln_refresh';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly financeService = inject(FinanceService);
  private readonly base = `${environment.apiUrl}/user`;

  private readonly _user = signal<AuthUser | null>(this.readStorage());
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);
  readonly isPremium = computed(() => (this._user()?.permisos ?? 1) >= 2);
  readonly isAdmin   = computed(() => this._user()?.permisos === 13579);

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.base}/login`, { email, password }).pipe(
      tap(res => {
        this.setUser(res.user);
        localStorage.setItem(TOKEN_KEY, res.accessToken);
        localStorage.setItem(REFRESH_KEY, res.refreshToken);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  register(name: string, email: string, password: string): Observable<unknown> {
    return this.http.post(`${this.base}/register`, { name, email, password });
  }

  logout(): Observable<unknown> {
    const refreshToken = this.getRefreshToken();
    return this.http.post(`${this.base}/logout`, { refreshToken }).pipe(
      tap(() => this.clearUser())
    );
  }

  getUserInfo(email: string): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.base}/${email}/info`).pipe(
      tap(user => this.setUser(user))
    );
  }

  updatePermisos(permisos: number): void {
    const user = this._user();
    if (user) this.setUser({ ...user, permisos });
  }

  updatePermisosTemporary(permisos: number): void {
    const user = this._user();
    if (user) this._user.set({ ...user, permisos });
  }

  clearUser(): void {
    this._user.set(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    this.financeService.resetState();
  }

  private setUser(user: AuthUser): void {
    this._user.set(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  private readStorage(): AuthUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }
}
