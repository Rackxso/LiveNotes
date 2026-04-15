import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../services/i18n.service';
import { EventosService } from '../../services/eventos.service';
import { Evento } from '../../model/evento.model';
import { MiniCalendar } from '../../components/commons/mini-calendar/mini-calendar';
import { GoalProgress } from '../../components/commons/goal-progress/goal-progress';
import { ToDo } from '../../components/to-do/to-do';
import { TextNotes } from '../../components/text-notes/text-notes';

interface HabitoItem {
  id: number;
  name: string;
  done: boolean;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, MiniCalendar, GoalProgress, ToDo, TextNotes],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly i18n = inject(I18nService);
  private readonly eventosService = inject(EventosService);
  readonly t = this.i18n.t;

  private readonly _today = new Date();

  readonly diaSeleccionado = signal<Date>(new Date());
  readonly mesCalendario = signal({ anyo: this._today.getFullYear(), mes: this._today.getMonth() });

  readonly eventos = this.eventosService.eventos;

  readonly fechaHoy = computed(() =>
    this._today.toLocaleDateString(this.i18n.locale(), {
      weekday: 'long', day: 'numeric', month: 'long',
    })
  );

  readonly eventosHoy = computed(() => {
    const t = this._today;
    return this.eventos().filter(e =>
      e.fecha.getDate() === t.getDate() &&
      e.fecha.getMonth() === t.getMonth() &&
      e.fecha.getFullYear() === t.getFullYear()
    );
  });

  readonly eventosDelMes = computed((): Evento[] => {
    const { anyo, mes } = this.mesCalendario();
    return this.eventos()
      .filter(e => e.fecha.getFullYear() === anyo && e.fecha.getMonth() === mes)
      .sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
  });

  readonly habitos = signal<HabitoItem[]>([
    { id: 1, name: 'Gym',     done: true  },
    { id: 2, name: 'Meditar', done: false },
    { id: 3, name: 'Leer',    done: true  },
  ]);

  readonly eventoLabel = (ev: Evento): string => {
    const hoy = this._today;
    const esHoy =
      ev.fecha.getDate() === hoy.getDate() &&
      ev.fecha.getMonth() === hoy.getMonth() &&
      ev.fecha.getFullYear() === hoy.getFullYear();

    const fecha = esHoy
      ? ''
      : ev.fecha.toLocaleDateString(this.i18n.locale(), { day: 'numeric', month: 'short' });

    return [fecha, ev.hora].filter(Boolean).join(' · ');
  };

  toggleHabito(id: number): void {
    this.habitos.update(items =>
      items.map(h => h.id === id ? { ...h, done: !h.done } : h)
    );
  }

  onDiaSeleccionado(fecha: Date): void {
    this.diaSeleccionado.set(fecha);
  }

  onMesVisibleChange(val: { anyo: number; mes: number }): void {
    this.mesCalendario.set(val);
  }
}
