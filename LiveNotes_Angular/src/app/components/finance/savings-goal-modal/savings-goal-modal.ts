import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  output,
  viewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiMetaDto, FinanceService } from '../../../services/finance.service';
import { PrimaryButton } from '../../commons/primary-button/primary-button';
import { SecondaryButton } from '../../commons/secondary-button/secondary-button';

@Component({
  selector: 'app-savings-goal-modal',
  imports: [ReactiveFormsModule, PrimaryButton, SecondaryButton],
  templateUrl: './savings-goal-modal.html',
  styleUrl: './savings-goal-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SavingsGoalModal {
  private readonly financeService = inject(FinanceService);

  readonly saved = output<void>();

  private readonly dialogEl = viewChild.required<ElementRef<HTMLDialogElement>>('dialogEl');

  readonly form = new FormGroup({
    name:   new FormControl('', { validators: [Validators.required], nonNullable: true }),
    target: new FormControl(0,  { validators: [Validators.required, Validators.min(0.01)], nonNullable: true }),
  });

  open(): void {
    this.form.reset({ name: '', target: 0 });
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
    const dto: ApiMetaDto = { name: v.name, meta: v.target };
    this.financeService.createMeta(dto).subscribe(() => {
      this.saved.emit();
      this.close();
    });
  }
}
