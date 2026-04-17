import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { HabitsService } from '../../../services/habits.service';
import { I18nService } from '../../../services/i18n.service';
import { PrimaryButton } from '../../commons/primary-button/primary-button';
import { SecondaryButton } from '../../commons/secondary-button/secondary-button';

@Component({
  selector: 'app-add-habit-modal',
  imports: [ReactiveFormsModule, PrimaryButton, SecondaryButton],
  templateUrl: './add-habit-modal.html',
  styleUrl: './add-habit-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddHabitModal {
  private readonly habitsService = inject(HabitsService);
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;

  readonly cerrar = output<void>();
  readonly guardado = output<void>();

  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
  });

  onGuardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.habitsService.createHabit({ name: this.form.controls.name.value.trim() }).subscribe({
      next: () => {
        this.guardado.emit();
        this.onCerrar();
      },
    });
  }

  onCerrar(): void {
    this.form.reset();
    this.cerrar.emit();
  }
}
