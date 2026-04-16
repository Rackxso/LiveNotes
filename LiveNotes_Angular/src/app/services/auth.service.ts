import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthUser {
  email: string;
  name: string;
}

interface LoginResponse {
  user: AuthUser;
}

const STORAGE_KEY = 'ln_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/user`;

  private readonly _user = signal<AuthUser | null>(this.readStorage());
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.base}/login`, { email, password }).pipe(
      tap(res => this.setUser(res.user))
    );
  }

  register(name: string, email: string, password: string): Observable<unknown> {
    return this.http.post(`${this.base}/register`, { name, email, password });
  }

  logout(): Observable<unknown> {
    return this.http.post(`${this.base}/logout`, {}).pipe(
      tap(() => this.clearUser())
    );
  }

  getUserInfo(email: string): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.base}/${email}/info`).pipe(
      tap(user => this.setUser(user))
    );
  }

  clearUser(): void {
    this._user.set(null);
    localStorage.removeItem(STORAGE_KEY);
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
