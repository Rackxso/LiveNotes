import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { Evento } from '../../model/evento.model';
import { EventCard } from '../commons/event-card/event-card';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-day-view',
  imports: [EventCard],
  templateUrl: './day-view.html',
  styleUrl: './day-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayView {
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;

  private readonly today = new Date();
  readonly horas = Array.from({ length: 24 }, (_, i) => i);

  // Inputs
  readonly eventos = input<Evento[]>([]);
  readonly diaSeleccionado = input<Date>(new Date());

  // Output
  readonly diaSeleccionadoChange = output<Date>();

  readonly nombreDia = computed(() =>
    this.diaSeleccionado().toLocaleDateString(this.i18n.locale(), {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  );

  readonly esHoy = computed(() => {
    const d = this.diaSeleccionado();
    return (
      d.getDate() === this.today.getDate() &&
      d.getMonth() === this.today.getMonth() &&
      d.getFullYear() === this.today.getFullYear()
    );
  });

  readonly eventosSinHora = computed(() => {
    const d = this.diaSeleccionado();
    return this.eventos().filter(
      e =>
        !e.hora &&
        e.fecha.getDate() === d.getDate() &&
        e.fecha.getMonth() === d.getMonth() &&
        e.fecha.getFullYear() === d.getFullYear()
    );
  });

  private horaDeEvento(evento: Evento): number {
    if (!evento.hora) return -1;
    return parseInt(evento.hora.split(':')[0], 10);
  }

  readonly eventosDeHora = (hora: number): Evento[] => {
    const d = this.diaSeleccionado();
    return this.eventos().filter(e => {
      const mismaFecha =
        e.fecha.getDate() === d.getDate() &&
        e.fecha.getMonth() === d.getMonth() &&
        e.fecha.getFullYear() === d.getFullYear();
      return mismaFecha && this.horaDeEvento(e) === hora;
    });
  };

  irAlDiaAnterior(): void {
    const d = new Date(this.diaSeleccionado());
    d.setDate(d.getDate() - 1);
    this.diaSeleccionadoChange.emit(d);
  }

  irAlDiaSiguiente(): void {
    const d = new Date(this.diaSeleccionado());
    d.setDate(d.getDate() + 1);
    this.diaSeleccionadoChange.emit(d);
  }

  irAHoy(): void {
    this.diaSeleccionadoChange.emit(new Date());
  }

  readonly formatHora = (hora: number): string =>
    `${hora.toString().padStart(2, '0')}:00`;
}
