import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { Evento } from '../../model/evento.model';
import { EventCard } from '../commons/event-card/event-card';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-week-view',
  imports: [EventCard],
  templateUrl: './week-view.html',
  styleUrl: './week-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeekView {
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;

  private readonly today = new Date();
  readonly horas = Array.from({ length: 24 }, (_, i) => i);

  /** Días de la semana localizados (Dom/Sun, Lun/Mon, …) */
  readonly diasSemana = computed<string[]>(() => {
    const locale = this.i18n.locale();
    const base = new Date(2006, 0, 1); // 1 ene 2006 era domingo
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d.toLocaleDateString(locale, { weekday: 'short' });
    });
  });

  // Inputs
  readonly eventos = input<Evento[]>([]);
  readonly diaSeleccionado = input<Date>(new Date());

  // Output
  readonly diaSeleccionadoChange = output<Date>();

  // Inicio de la semana mostrada (domingo)
  readonly inicioSemana = signal<Date>(
    (() => {
      const d = new Date();
      d.setDate(d.getDate() - d.getDay());
      d.setHours(0, 0, 0, 0);
      return d;
    })()
  );

  constructor() {
    effect(() => {
      const sel = this.diaSeleccionado();
      const d = new Date(sel);
      d.setDate(d.getDate() - d.getDay());
      d.setHours(0, 0, 0, 0);
      this.inicioSemana.set(d);
    });
  }

  readonly diasDeSemana = computed(() => {
    const inicio = this.inicioSemana();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(inicio);
      d.setDate(inicio.getDate() + i);
      return d;
    });
  });

  readonly nombreSemana = computed(() => {
    const locale = this.i18n.locale();
    const dias = this.diasDeSemana();
    const inicio = dias[0];
    const fin = dias[6];
    return `${inicio.toLocaleDateString(locale, { month: 'short', day: 'numeric' })} – ${fin.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}`;
  });

  readonly hayEventosSinHora = computed(() =>
    this.diasDeSemana().some(dia =>
      this.eventos().some(e =>
        !e.hora &&
        e.fecha.getDate() === dia.getDate() &&
        e.fecha.getMonth() === dia.getMonth() &&
        e.fecha.getFullYear() === dia.getFullYear()
      )
    )
  );

  readonly esHoy = (dia: Date): boolean =>
    dia.getDate() === this.today.getDate() &&
    dia.getMonth() === this.today.getMonth() &&
    dia.getFullYear() === this.today.getFullYear();

  readonly esSeleccionado = (dia: Date): boolean => {
    const sel = this.diaSeleccionado();
    return dia.getDate() === sel.getDate() &&
      dia.getMonth() === sel.getMonth() &&
      dia.getFullYear() === sel.getFullYear();
  };

  private horaDeEvento(evento: Evento): number {
    if (!evento.hora) return -1;
    return parseInt(evento.hora.split(':')[0], 10);
  }

  readonly eventosDeDiaHora = (dia: Date, hora: number): Evento[] =>
    this.eventos().filter(e => {
      const mismaFecha =
        e.fecha.getDate() === dia.getDate() &&
        e.fecha.getMonth() === dia.getMonth() &&
        e.fecha.getFullYear() === dia.getFullYear();
      return mismaFecha && this.horaDeEvento(e) === hora;
    });

  readonly tieneEventos = (dia: Date): boolean =>
    this.eventos().some(e =>
      e.fecha.getDate() === dia.getDate() &&
      e.fecha.getMonth() === dia.getMonth() &&
      e.fecha.getFullYear() === dia.getFullYear()
    );

  readonly eventosDelDia = (dia: Date): Evento[] =>
    this.eventos()
      .filter(e =>
        e.fecha.getDate() === dia.getDate() &&
        e.fecha.getMonth() === dia.getMonth() &&
        e.fecha.getFullYear() === dia.getFullYear()
      )
      .sort((a, b) => (a.hora ?? '').localeCompare(b.hora ?? ''));

  readonly diaNombreCompleto = (dia: Date): string =>
    dia.toLocaleDateString(this.i18n.locale(), {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

  readonly eventosSinHoraDia = (dia: Date): Evento[] =>
    this.eventos().filter(e =>
      !e.hora &&
      e.fecha.getDate() === dia.getDate() &&
      e.fecha.getMonth() === dia.getMonth() &&
      e.fecha.getFullYear() === dia.getFullYear()
    );

  seleccionarDia(dia: Date): void {
    this.diaSeleccionadoChange.emit(new Date(dia));
  }

  irASemanaAnterior(): void {
    const inicio = new Date(this.inicioSemana());
    inicio.setDate(inicio.getDate() - 7);
    this.inicioSemana.set(inicio);
  }

  irASemanaSiguiente(): void {
    const inicio = new Date(this.inicioSemana());
    inicio.setDate(inicio.getDate() + 7);
    this.inicioSemana.set(inicio);
  }

  irAHoy(): void {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    this.inicioSemana.set(d);
  }

  readonly formatHora = (hora: number): string =>
    `${hora.toString().padStart(2, '0')}:00`;
}
