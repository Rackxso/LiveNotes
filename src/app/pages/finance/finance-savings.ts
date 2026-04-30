import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { FinanceService, SavingsGoal } from '../../services/finance.service';
import { I18nService } from '../../services/i18n.service';
import { AuthService } from '../../services/auth.service';
import { SavingsGoalModal } from '../../components/finance/savings-goal-modal/savings-goal-modal';
import { PaywallModal } from '../../components/commons/paywall-modal/paywall-modal';

const FREE_SAVINGS_LIMIT = 3;

@Component({
  selector: 'app-finance-savings',
  imports: [SavingsGoalModal, PaywallModal],
  templateUrl: './finance-savings.html',
  styleUrl: './finance-savings.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinanceSavings {
  readonly finance = inject(FinanceService);
  private readonly auth = inject(AuthService);
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;
  private readonly locale = this.i18n.locale;

  readonly modal = viewChild.required<SavingsGoalModal>('modal');
  readonly paywall = viewChild.required<PaywallModal>('paywall');

  readonly atLimit = computed(() =>
    !this.auth.isPremium() && this.finance.savingsGoals().length >= FREE_SAVINGS_LIMIT
  );

  openModal(): void {
    if (this.atLimit()) {
      this.paywall().open();
    } else {
      this.modal().open();
    }
  }

  openEdit(goal: { id: string; name: string; target: number }): void {
    this.modal().open(goal);
  }

  private readonly maxMonthlySaved = computed(() =>
    Math.max(...this.finance.monthlyStats().map(s => s.saved), 1)
  );

  goalPct(goal: SavingsGoal): number {
    return Math.min(Math.round((goal.saved / goal.target) * 100), 100);
  }

  fmt(amount: number): string {
    return amount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  barH(value: number): number {
    return Math.round((value / this.maxMonthlySaved()) * 80);
  }

  fmtDate(date: Date): string {
    return date.toLocaleDateString(this.locale(), { day: 'numeric', month: 'short' });
  }

  readonly closestGoal = computed(() =>
    [...this.finance.savingsGoals()]
      .filter(g => g.saved < g.target)
      .sort((a, b) => (b.saved / b.target) - (a.saved / a.target))[0] ?? null
  );

  monthsToComplete(goal: SavingsGoal): number | null {
    if (goal.saved >= goal.target) return null;
    const deposits = this.finance.recentDeposits().filter(d => d.goalName === goal.name);
    if (!deposits.length) return null;

    const monthTotals = new Map<string, number>();
    for (const d of deposits) {
      const key = `${d.date.getFullYear()}-${d.date.getMonth()}`;
      monthTotals.set(key, (monthTotals.get(key) ?? 0) + d.amount);
    }

    const sorted = Array.from(monthTotals.values()).sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];

    if (median <= 0) return null;
    return Math.ceil((goal.target - goal.saved) / median);
  }
}
