import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiPresupuestoDto, FinanceService } from '../../../services/finance.service';
import { PrimaryButton } from '../../commons/primary-button/primary-button';
import { SecondaryButton } from '../../commons/secondary-button/secondary-button';

export const BUDGET_COLORS = [
  '#7A5A8A', '#5A8A60', '#B85040', '#4A7FA5',
  '#D4956A', '#C8784A', '#6A8A7A', '#8A6A5A',
];

@Component({
  selector: 'app-budget-modal',
  imports: [ReactiveFormsModule, PrimaryButton, SecondaryButton],
  templateUrl: './budget-modal.html',
  styleUrl: './budget-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetModal {
  private readonly financeService = inject(FinanceService);

  readonly saved = output<void>();
  readonly deleted = output<void>();
  readonly colors = BUDGET_COLORS;
  readonly selectedColor = signal(BUDGET_COLORS[0]);
  readonly mode = signal<'create' | 'edit'>('create');
  readonly editingId = signal<string | null>(null);
  readonly editingName = signal<string>('');

  private readonly dialogEl = viewChild.required<ElementRef<HTMLDialogElement>>('dialogEl');

  readonly months = [
    { value: 1,  label: 'Enero' },     { value: 2,  label: 'Febrero' },
    { value: 3,  label: 'Marzo' },     { value: 4,  label: 'Abril' },
    { value: 5,  label: 'Mayo' },      { value: 6,  label: 'Junio' },
    { value: 7,  label: 'Julio' },     { value: 8,  label: 'Agosto' },
    { value: 9,  label: 'Septiembre' },{ value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' }, { value: 12, label: 'Diciembre' },
  ];

  readonly form = new FormGroup({
    nombre: new FormControl('',   { validators: [Validators.required], nonNullable: true }),
    limite: new FormControl(0,    { validators: [Validators.required, Validators.min(0.01)], nonNullable: true }),
    mes:    new FormControl(new Date().getMonth() + 1, { validators: [Validators.required], nonNullable: true }),
    anio:   new FormControl(new Date().getFullYear(),  { validators: [Validators.required], nonNullable: true }),
  });

  open(budget?: { id: string; name: string; limite: number }): void {
    const today = new Date();
    if (budget) {
      this.mode.set('edit');
      this.editingId.set(budget.id);
      this.editingName.set(budget.name);
      this.form.reset({ nombre: budget.name, limite: budget.limite, mes: today.getMonth() + 1, anio: today.getFullYear() });
    } else {
      this.mode.set('create');
      this.editingId.set(null);
      this.editingName.set('');
      this.form.reset({ nombre: '', limite: 0, mes: today.getMonth() + 1, anio: today.getFullYear() });
      this.selectedColor.set(BUDGET_COLORS[0]);
    }
    this.dialogEl().nativeElement.showModal();
  }

  close(): void {
    this.dialogEl().nativeElement.close();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialogEl().nativeElement) this.close();
  }

  submit(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();

    if (this.mode() === 'edit') {
      const id = this.editingId()!;
      this.financeService.updatePresupuesto(id, v.limite).subscribe(() => {
        this.saved.emit();
        this.close();
      });
    } else {
      const dto: ApiPresupuestoDto = {
        nombre: v.nombre,
        color: this.selectedColor(),
        limite: v.limite,
        mes: v.mes,
        anio: v.anio,
      };
      this.financeService.createPresupuesto(dto).subscribe(() => {
        this.saved.emit();
        this.close();
      });
    }
  }

  deleteBudget(): void {
    const id = this.editingId();
    if (!id) return;
    this.financeService.deletePresupuesto(id).subscribe(() => {
      this.deleted.emit();
      this.close();
    });
  }
}
