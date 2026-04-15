import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FinanceService, Transaction } from '../../../services/finance.service';
import { I18nService } from '../../../services/i18n.service';

@Component({
  selector: 'app-transaction-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './transaction-modal.html',
  styleUrl: './transaction-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionModal {
  private readonly financeService = inject(FinanceService);
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;
  private readonly locale = this.i18n.locale;

  readonly transaction = input<Transaction | null>(null);
  readonly saved = output<void>();

  readonly budgetCategories = this.financeService.budgetCategories;
  readonly mode = signal<'view' | 'create'>('view');
  readonly selectedType = signal<'income' | 'expense'>('expense');

  private readonly dialogEl = viewChild.required<ElementRef<HTMLDialogElement>>('dialogEl');

  readonly form = new FormGroup({
    name:        new FormControl('',          { validators: [Validators.required], nonNullable: true }),
    amount:      new FormControl(0,           { validators: [Validators.required, Validators.min(0.01)], nonNullable: true }),
    date:        new FormControl('',          { validators: [Validators.required], nonNullable: true }),
    categoryKey: new FormControl<Transaction['categoryKey']>('untracked', { nonNullable: true }),
  });

  readonly formattedAmount = computed(() => {
    const tx = this.transaction();
    if (!tx) return '';
    const abs = Math.abs(tx.amount).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return tx.amount >= 0 ? `+${abs} €` : `-${abs} €`;
  });

  readonly formattedDate = computed(() => {
    const tx = this.transaction();
    if (!tx) return '';
    return tx.date.toLocaleDateString(this.locale(), {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
  });

  readonly amountClass = computed(() => {
    const tx = this.transaction();
    if (!tx) return '';
    return tx.amount >= 0 ? 'pos' : 'neg';
  });

  open(mode: 'view' | 'create'): void {
    this.mode.set(mode);
    if (mode === 'create') {
      this.selectedType.set('expense');
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      this.form.reset({ categoryKey: 'untracked', date: `${yyyy}-${mm}-${dd}` });
    }
    this.dialogEl().nativeElement.showModal();
  }

  close(): void {
    this.dialogEl().nativeElement.close();
  }

  setType(type: 'income' | 'expense'): void {
    this.selectedType.set(type);
    if (type === 'income') {
      this.form.controls.categoryKey.setValue('work');
    } else {
      this.form.controls.categoryKey.setValue('untracked');
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialogEl().nativeElement) {
      this.close();
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const type = this.selectedType();
    const finalAmount = type === 'income' ? Math.abs(v.amount) : -Math.abs(v.amount);
    const categoryKey = type === 'income' ? 'work' as const : v.categoryKey;
    const cat = this.financeService.budgetCategories().find(c => c.categoryKey === categoryKey);
    const categoryName = type === 'income'
      ? 'Trabajo'
      : (cat?.name ?? 'Sin trazar');

    const [year, month, day] = v.date.split('-').map(Number);

    this.financeService.addTransaction({
      name: v.name,
      amount: finalAmount,
      date: new Date(year, month - 1, day),
      categoryKey,
      category: categoryName,
    });

    this.saved.emit();
    this.close();
  }
}
