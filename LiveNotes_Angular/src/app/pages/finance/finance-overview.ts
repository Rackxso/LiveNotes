import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MoneyCard } from '../../components/commons/money-card/money-card';
import { GoalProgress } from '../../components/commons/goal-progress/goal-progress';
import { TransactionItem } from '../../components/finance/transaction-item/transaction-item';
import { FinanceService, SavingsGoal } from '../../services/finance.service';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-finance-overview',
  imports: [MoneyCard, GoalProgress, TransactionItem, RouterLink],
  templateUrl: './finance-overview.html',
  styleUrl: './finance-overview.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinanceOverview {
  private readonly finance = inject(FinanceService);
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;

  readonly recentTransactions = computed(() =>
    this.finance.transactions().slice(0, 5)
  );

  readonly monthlyStats = this.finance.monthlyStats;
  readonly savingsGoals = this.finance.savingsGoals;
  readonly totalSaved = this.finance.totalSaved;

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
