import { Injectable, computed, signal } from '@angular/core';
import en from '../../lenguajes/en.json';
import es from '../../lenguajes/es.json';

export type SupportedLang = 'en' | 'es';

const LOCALES: Record<SupportedLang, string> = {
  en: 'en-US',
  es: 'es-ES',
};

// Registro de traducciones: para añadir un nuevo idioma, importar su JSON,
// añadirlo aquí y extender SupportedLang.
const TRANSLATIONS: Record<SupportedLang, Record<string, unknown>> = { en, es };

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly STORAGE_KEY = 'app-lang';

  private readonly _lang = signal<SupportedLang>(this.loadLang());

  /** Idioma activo (solo lectura) */
  readonly lang = this._lang.asReadonly();

  /** Locale BCP-47 para usar en toLocaleString / toLocaleDateString */
  readonly locale = computed<string>(() => LOCALES[this._lang()]);

  /**
   * Función traductora reactiva.
   * Es un Signal<(key: string) => string>: cuando cambia el idioma, el computed
   * se invalida y los componentes OnPush que lo lean se re-renderizan.
   *
   * Uso en componentes:
   *   readonly t = inject(I18nService).t;
   * Uso en template:
   *   {{ t()('nav.home') }}
   */
  readonly t = computed<(key: string) => string>(() => {
    const translations = TRANSLATIONS[this._lang()];
    return (key: string): string => this.resolve(translations, key) ?? key;
  });

  setLang(lang: SupportedLang): void {
    this._lang.set(lang);
    localStorage.setItem(this.STORAGE_KEY, lang);
  }

  private loadLang(): SupportedLang {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved === 'en' || saved === 'es') return saved;
    return navigator.language.startsWith('es') ? 'es' : 'en';
  }

  /** Navega por el JSON con dot-notation: 'nav.home' → obj.nav.home */
  private resolve(obj: Record<string, unknown>, key: string): string | undefined {
    const parts = key.split('.');
    let cur: unknown = obj;
    for (const p of parts) {
      if (cur == null || typeof cur !== 'object') return undefined;
      cur = (cur as Record<string, unknown>)[p];
    }
    return typeof cur === 'string' ? cur : undefined;
  }
}
