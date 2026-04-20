import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MoneyCard } from '../../components/commons/money-card/money-card';
import { GoalProgress } from '../../components/commons/goal-progress/goal-progress';
import { TransactionItem } from '../../components/finance/transaction-item/transaction-item';
import { TransactionModal } from '../../components/finance/transaction-modal/transaction-modal';
import { FinanceService, SavingsGoal, Transaction } from '../../services/finance.service';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-finance-overview',
  imports: [MoneyCard, GoalProgress, TransactionItem, TransactionModal, RouterLink],
  templateUrl: './finance-overview.html',
  styleUrl: './finance-overview.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinanceOverview {
  private readonly finance = inject(FinanceService);
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;

  private readonly nowM = new Date().getMonth();
  private readonly nowY = new Date().getFullYear();
  private readonly prevDate = new Date(this.nowY, this.nowM - 1, 1);
  private readonly prevM = this.prevDate.getMonth();
  private readonly prevY = this.prevDate.getFullYear();

  readonly modal = viewChild.required<TransactionModal>('modal');
  readonly selectedTransaction = signal<Transaction | null>(null);

  readonly recentTransactions = computed(() =>
    this.finance.transactions().slice(0, 5)
  );

  openView(tx: Transaction): void {
    this.selectedTransaction.set(tx);
    this.modal().open('view');
  }

  openCreate(): void {
    this.selectedTransaction.set(null);
    this.modal().open('create');
  }

  readonly monthlyStats = this.finance.monthlyStats;
  readonly savingsGoals = this.finance.savingsGoals;
  readonly totalSaved = this.finance.totalSaved;

  readonly totalBalance = computed(() =>
    this.finance.transactions().reduce((sum, t) => sum + t.amount, 0)
  );

  readonly currentMonthIncome = computed(() => {
    const m = this.nowM, y = this.nowY;
    return this.finance.transactions()
      .filter(t => t.amount > 0 && t.date.getMonth() === m && t.date.getFullYear() === y)
      .reduce((sum, t) => sum + t.amount, 0);
  });

  readonly currentMonthExpenses = computed(() => {
    const m = this.nowM, y = this.nowY;
    return this.finance.transactions()
      .filter(t => t.amount < 0 && t.date.getMonth() === m && t.date.getFullYear() === y)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  });

  private readonly prevMonthIncome = computed(() => {
    const pm = this.prevM, py = this.prevY;
    return this.finance.transactions()
      .filter(t => t.amount > 0 && t.date.getMonth() === pm && t.date.getFullYear() === py)
      .reduce((sum, t) => sum + t.amount, 0);
  });

  private readonly prevMonthExpenses = computed(() => {
    const pm = this.prevM, py = this.prevY;
    return this.finance.transactions()
      .filter(t => t.amount < 0 && t.date.getMonth() === pm && t.date.getFullYear() === py)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  });

  private readonly prevBalance = computed(() => {
    const currentMonthNet = this.finance.transactions()
      .filter(t => t.date.getMonth() === this.nowM && t.date.getFullYear() === this.nowY)
      .reduce((sum, t) => sum + t.amount, 0);
    return this.totalBalance() - currentMonthNet;
  });

  readonly balancePct    = computed(() => this.pctStr(this.prevBalance(), this.totalBalance()));
  readonly balancePctUp  = computed(() => this.totalBalance() >= this.prevBalance());
  readonly incomePct     = computed(() => this.pctStr(this.prevMonthIncome(), this.currentMonthIncome()));
  readonly incomePctUp   = computed(() => this.currentMonthIncome() >= this.prevMonthIncome());
  readonly expensesPct   = computed(() => this.pctStr(this.prevMonthExpenses(), this.currentMonthExpenses()));
  readonly expensesPctUp = computed(() => this.currentMonthExpenses() >= this.prevMonthExpenses());

  private pctStr(prev: number, current: number): string {
    if (prev === 0) return '—';
    const pct = Math.abs(Math.round(((current - prev) / prev) * 100));
    return `${pct} %`;
  }

  private readonly maxMonthly = computed(() => {
    const stats = this.finance.monthlyStats();
    return Math.max(...stats.map(s => Math.max(s.income, s.expenses)), 1);
  });

  incomeH(value: number): number {
    return Math.round((value / this.maxMonthly()) * 80);
  }

  expensesH(value: number): number {
    return Math.round((value / this.maxMonthly()) * 80);
  }

  goalPct(goal: SavingsGoal): number {
    return Math.min(Math.round((goal.saved / goal.target) * 100), 100);
  }

  readonly spendingInsight = computed(() => {
    const stats = this.finance.monthlyStats();
    if (stats.length < 2) return null;
    const current  = stats[stats.length - 1];
    const previous = stats[stats.length - 2];
    const diff = current.expenses - previous.expenses;
    const pct  = Math.abs(Math.round((diff / previous.expenses) * 100));
    return { pct, up: diff > 0, month: current.month };
  });

  fmt(amount: number): string {
    return amount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
