import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { HabitsService } from '../../../services/habits.service';
import { I18nService } from '../../../services/i18n.service';
import { PrimaryButton } from '../../commons/primary-button/primary-button';
import { SecondaryButton } from '../../commons/secondary-button/secondary-button';

const HABIT_ICONS = [
  'fa-solid fa-dumbbell',
  'fa-solid fa-person-running',
  'fa-solid fa-droplet',
  'fa-solid fa-book',
  'fa-solid fa-bed',
  'fa-solid fa-utensils',
  'fa-solid fa-brain',
  'fa-solid fa-heart',
  'fa-solid fa-bicycle',
  'fa-solid fa-music',
  'fa-solid fa-pencil',
  'fa-solid fa-moon',
  'fa-solid fa-sun',
  'fa-solid fa-leaf',
  'fa-solid fa-pills',
  'fa-solid fa-laptop',
  'fa-solid fa-mug-hot',
  'fa-solid fa-spa',
];

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

  readonly icons = HABIT_ICONS;
  readonly selectedIcon = signal(HABIT_ICONS[0]);

  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
  });

  selectIcon(icon: string): void {
    this.selectedIcon.set(icon);
  }

  onGuardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.habitsService.createHabit({
      name: this.form.controls.name.value.trim(),
      icon: this.selectedIcon(),
    }).subscribe({
      next: () => {
        this.guardado.emit();
        this.onCerrar();
      },
    });
  }

  onCerrar(): void {
    this.form.reset();
    this.selectedIcon.set(HABIT_ICONS[0]);
    this.cerrar.emit();
  }
}
