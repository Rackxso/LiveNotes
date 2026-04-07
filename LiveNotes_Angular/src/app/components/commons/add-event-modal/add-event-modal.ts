// add-event-modal.ts
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Evento } from '../../../model/evento.model';


@Component({
  selector: 'app-add-event-modal',
  imports: [FormsModule],
  templateUrl: './add-event-modal.html',
  styleUrl: './add-event-modal.css',
})
export class AddEventModal {
  readonly fechaInicial = input<Date | null>(null);
  readonly cerrar = output<void>();
  readonly guardar = output<Omit<Evento, 'id'>>();

  titulo = '';
  descripcion = '';
  fecha = '';
  hora = '';

  ngOnInit(): void {
    const f = this.fechaInicial();
    if (f) {
      this.fecha = this.dateToInputValue(f);
    }
  }

  private dateToInputValue(d: Date): string {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  onGuardar(): void {
    if (!this.titulo.trim() || !this.fecha) return;
    const [yyyy, mm, dd] = this.fecha.split('-').map(Number);
    this.guardar.emit({
      titulo: this.titulo.trim(),
      descripcion: this.descripcion.trim() || undefined,
      fecha: new Date(yyyy, mm - 1, dd),
      hora: this.hora || undefined,
    });
    this.onCerrar();
  }

  onCerrar(): void {
    this.titulo = '';
    this.descripcion = '';
    this.fecha = '';
    this.hora = '';
    this.cerrar.emit();
  }
}