import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FinanceService, Transaction } from '../../services/finance.service';
import { I18nService } from '../../services/i18n.service';
import { TransactionItem } from '../../components/finance/transaction-item/transaction-item';
import { TransactionModal } from '../../components/finance/transaction-modal/transaction-modal';
import { PrimaryButton } from '../../components/commons/primary-button/primary-button';

type FilterKey = Transaction['categoryKey'] | 'all';

interface TxGroup {
  label: string;
  dateKey: string;
  items: Transaction[];
}

@Component({
  selector: 'app-finance-transactions',
  imports: [TransactionItem, TransactionModal, PrimaryButton],
  templateUrl: './finance-transactions.html',
  styleUrl: './finance-transactions.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinanceTransactions {
  readonly finance = inject(FinanceService);
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;

  readonly modal = viewChild.required<TransactionModal>('modal');
  readonly selectedTransaction = signal<Transaction | null>(null);
  readonly activeFilter = signal<FilterKey>('all');

  readonly filters: { key: FilterKey; labelKey: string; color: string }[] = [
    { key: 'all',           labelKey: 'finance.cat.all',           color: 'var(--text-subcolor)' },
    { key: 'food',          labelKey: 'finance.cat.food',          color: 'var(--accent-color)' },
    { key: 'housing',       labelKey: 'finance.cat.housing',       color: 'var(--blue)' },
    { key: 'entertainment', labelKey: 'finance.cat.entertainment', color: 'var(--purple)' },
    { key: 'work',          labelKey: 'finance.cat.work',          color: 'var(--green)' },
    { key: 'untracked',     labelKey: 'finance.cat.untracked',     color: 'var(--text-subcolor)' },
  ];

  private readonly filteredTransactions = computed(() => {
    const txs = this.finance.transactions();
    const filter = this.activeFilter();
    const list = filter === 'all' ? txs : txs.filter(t => t.categoryKey === filter);
    return [...list].sort((a, b) => b.date.getTime() - a.date.getTime());
  });

  readonly groupedTransactions = computed<TxGroup[]>(() => {
    const txs = this.filteredTransactions();
    const locale = this.i18n.locale();
    const map = new Map<string, { date: Date; items: Transaction[] }>();

    for (const tx of txs) {
      const key = tx.date.toDateString();
      if (!map.has(key)) map.set(key, { date: tx.date, items: [] });
      map.get(key)!.items.push(tx);
    }

    return Array.from(map.entries()).map(([dateKey, { date, items }]) => ({
      dateKey,
      label: date.toLocaleDateString(locale, { day: 'numeric', month: 'long' }),
      items,
    }));
  });

  readonly monthIncome = computed(() =>
    this.filteredTransactions()
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  readonly monthExpenses = computed(() =>
    this.filteredTransactions()
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
  );

  readonly isEmpty = computed(() => this.filteredTransactions().length === 0);

  fmt(amount: number): string {
    return amount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  openView(tx: Transaction): void {
    this.selectedTransaction.set(tx);
    this.modal().open('view');
  }

  openCreate(): void {
    this.selectedTransaction.set(null);
    this.modal().open('create');
  }
}
