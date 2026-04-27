import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Transaction } from '../../../services/finance.service';
import { I18nService } from '../../../services/i18n.service';

@Component({
  selector: 'app-transaction-item',
  imports: [],
  templateUrl: './transaction-item.html',
  styleUrl: './transaction-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionItem {
  private readonly i18n = inject(I18nService);

  readonly transaction = input.required<Transaction>();

  readonly categoryColor = computed(() =>
    this.transaction().categoryColor || 'var(--primary-color)'
  );

  readonly borderColor = computed(() =>
    this.transaction().categoryColor || 'transparent'
  );

  readonly amountClass = computed(() =>
    this.transaction().amount >= 0 ? 'pos' : 'neg'
  );

  readonly formattedAmount = computed(() => {
    const amt = this.transaction().amount;
    const abs = Math.abs(amt).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return amt >= 0 ? `+${abs} €` : `-${abs} €`;
  });

  readonly formattedDate = computed(() =>
    this.transaction().date.toLocaleDateString(this.i18n.locale(), { day: 'numeric', month: 'short' })
  );
}
