import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { FinanceService } from '../../../services/finance.service';
import { AuthService } from '../../../services/auth.service';
import { I18nService } from '../../../services/i18n.service';
import { PrimaryButton } from '../primary-button/primary-button';
import { BudgetModal } from '../../finance/budget-modal/budget-modal';
import { PaywallModal } from '../paywall-modal/paywall-modal';

const FREE_BUDGET_LIMIT = 3;

@Component({
  selector: 'app-goal-progress',
  imports: [PrimaryButton, BudgetModal, PaywallModal],
  templateUrl: './goal-progress.html',
  styleUrl: './goal-progress.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalProgress {
  private readonly finance = inject(FinanceService);
  private readonly auth    = inject(AuthService);
  private readonly i18n    = inject(I18nService);
  readonly t = this.i18n.t;

  readonly goals    = this.finance.categorySpending;
  readonly modal    = viewChild.required<BudgetModal>('modal');
  readonly paywall  = viewChild.required<PaywallModal>('paywall');

  readonly atLimit = computed(() =>
    !this.auth.isPremium() && this.finance.budgetCategories().length >= FREE_BUDGET_LIMIT
  );

  openModal(): void {
    if (this.atLimit()) {
      this.paywall().open();
    } else {
      this.modal().open();
    }
  }

  openEdit(budget: { id: string; name: string; limite: number }): void {
    this.modal().open(budget);
  }

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
