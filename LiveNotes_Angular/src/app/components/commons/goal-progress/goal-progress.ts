import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgStyle } from '@angular/common';
import { PrimaryButton } from '../primary-button/primary-button';
import { I18nService } from '../../../services/i18n.service';

interface Goal {
  name: string;
  spent: number;
  budget: number;
  color: string;
}

@Component({
  selector: 'app-goal-progress',
  imports: [NgStyle, PrimaryButton],
  templateUrl: './goal-progress.html',
  styleUrl: './goal-progress.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalProgress {
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;

  readonly primaryButton = computed(() => ({ texto: this.t()('finance.add'), url: '#' }));

  goals: Goal[] = [
    { name: 'Groceries',     spent: 424.63, budget: 300,  color: '#b85c4a' },
    { name: 'Housing',       spent: 590.34, budget: 600,  color: '#5a7fb5' },
    { name: 'Entertainment', spent: 40,     budget: 100,  color: '#7b5ea7' },
  ];

  getProgress(goal: Goal): number {
    return Math.min((goal.spent / goal.budget) * 100, 100);
  }

  isOverBudget(goal: Goal): boolean {
    return goal.spent > goal.budget;
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + '€';
  }
}
