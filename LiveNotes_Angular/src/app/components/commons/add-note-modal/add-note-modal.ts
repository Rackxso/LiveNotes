import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotesService, NoteDto } from '../../../services/notes.service';
import { PrimaryButton } from '../primary-button/primary-button';
import { SecondaryButton } from '../secondary-button/secondary-button';

@Component({
  selector: 'app-add-note-modal',
  imports: [ReactiveFormsModule, PrimaryButton, SecondaryButton],
  templateUrl: './add-note-modal.html',
  styleUrl: './add-note-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNoteModal {
  private readonly notesService = inject(NotesService);

  readonly cerrar = output<void>();
  readonly guardado = output<void>();

  readonly form = new FormGroup({
    titulo: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
    contenido: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(2000)] }),
  });

  onGuardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const dto: NoteDto = {
      titulo: this.form.controls.titulo.value.trim(),
      contenido: this.form.controls.contenido.value.trim(),
    };
    this.notesService.createNote(dto).subscribe({
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
