import { effect, Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'ln_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(this.readStorage());

  constructor() {
    effect(() => this.apply(this.theme()));

    // Reaplica si el sistema cambia (solo relevante en modo 'system')
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        if (this.theme() === 'system') this.apply('system');
      });
  }

  set(t: Theme): void {
    this.theme.set(t);
    localStorage.setItem(STORAGE_KEY, t);
  }

  private apply(t: Theme): void {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const useDark = t === 'dark' || (t === 'system' && prefersDark);
    document.documentElement.classList.toggle('dark-theme', useDark);
  }

  private readStorage(): Theme {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'light' || v === 'dark' || v === 'system' ? v : 'system';
  }
}
