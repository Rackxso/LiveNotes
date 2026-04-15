import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Header } from '../../components/header/header';
import { I18nService } from '../../services/i18n.service';
import { FinanceOverview } from './finance-overview';
import { FinanceTransactions } from './finance-transactions';
import { FinanceSavings } from './finance-savings';

@Component({
  selector: 'app-finance',
  imports: [Header, FinanceOverview, FinanceTransactions, FinanceSavings],
  templateUrl: './finance.html',
  styleUrl: './finance.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Finance {
  private readonly route  = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly i18n   = inject(I18nService);
  readonly t = this.i18n.t;

  readonly vistaActual = signal<string>('Overview');

  readonly vistasPage = computed<string[]>(() => [
    this.t()('finance.views.overview'),
    this.t()('finance.views.transactions'),
    this.t()('finance.views.savings'),
  ]);

  readonly vistaActivaTraducida = computed(() => {
    const map: Record<string, string> = {
      Overview:     'finance.views.overview',
      Transactions: 'finance.views.transactions',
      Savings:      'finance.views.savings',
    };
    return this.t()(map[this.vistaActual()] ?? 'finance.views.overview');
  });

  readonly nombreVista = computed(() => this.t()('finance.pageTitle'));

  constructor() {
    this.route.url.subscribe(segments => {
      const last = segments[segments.length - 1]?.path;
      this.vistaActual.set(this.urlToKey(last));
    });
  }

  private urlToKey(view: string | undefined): string {
    switch (view) {
      case 'transactions': return 'Transactions';
      case 'savings':      return 'Savings';
      default:             return 'Overview';
    }
  }

  onVistaSeleccionada(label: string): void {
    const reverse: Record<string, string> = {
      [this.t()('finance.views.overview')]:     'Overview',
      [this.t()('finance.views.transactions')]: 'Transactions',
      [this.t()('finance.views.savings')]:      'Savings',
    };
    const key = reverse[label] ?? 'Overview';
    this.vistaActual.set(key);
    this.router.navigate(['/finance', key.toLowerCase()]);
  }
}
