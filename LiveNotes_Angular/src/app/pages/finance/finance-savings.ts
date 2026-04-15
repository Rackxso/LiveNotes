import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FinanceService, SavingsGoal } from '../../services/finance.service';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-finance-savings',
  imports: [],
  templateUrl: './finance-savings.html',
  styleUrl: './finance-savings.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinanceSavings {
  readonly finance = inject(FinanceService);
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;
  private readonly locale = this.i18n.locale;

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

  monthsToComplete(goal: SavingsGoal): number | null {
    if (goal.saved >= goal.target) return null;
    const deposits = this.finance.recentDeposits().filter(d => d.goalName === goal.name);
    if (!deposits.length) return null;
    const totalDeposited = deposits.reduce((s, d) => s + d.amount, 0);
    const avgPerMonth = totalDeposited / 2;
    if (avgPerMonth <= 0) return null;
    return Math.ceil((goal.target - goal.saved) / avgPerMonth);
  }
}
