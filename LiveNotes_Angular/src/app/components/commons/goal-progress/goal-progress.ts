import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FinanceService } from '../../../services/finance.service';
import { I18nService } from '../../../services/i18n.service';

@Component({
  selector: 'app-goal-progress',
  imports: [],
  templateUrl: './goal-progress.html',
  styleUrl: './goal-progress.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalProgress {
  private readonly finance = inject(FinanceService);
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;

  readonly goals = this.finance.categorySpending;

  getProgress(spent: number, budget: number): number {
    return Math.min((spent / budget) * 100, 100);
  }

  isOverBudget(spent: number, budget: number): boolean {
    return spent > budget;
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + '€';
  }
}
