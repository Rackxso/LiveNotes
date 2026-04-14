import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService, SupportedLang } from '../../../services/i18n.service';

@Component({
  selector: 'app-lang-selector',
  imports: [],
  templateUrl: './lang-selector.html',
  styleUrl: './lang-selector.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangSelector {
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;
  readonly lang = this.i18n.lang;

  setLang(lang: SupportedLang): void {
    this.i18n.setLang(lang);
  }
}
