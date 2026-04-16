import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../services/i18n.service';
import { AuthService } from '../../services/auth.service';
import { EventosService } from '../../services/eventos.service';
import { FinanceService } from '../../services/finance.service';
import { Evento } from '../../model/evento.model';
import { MiniCalendar } from '../../components/commons/mini-calendar/mini-calendar';
import { GoalProgress } from '../../components/commons/goal-progress/goal-progress';
import { ToDo } from '../../components/to-do/to-do';
import { TextNotes } from '../../components/text-notes/text-notes';

@Component({
  selector: 'app-home',
  imports: [RouterLink, DecimalPipe, MiniCalendar, GoalProgress, ToDo, TextNotes],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly i18n           = inject(I18nService);
  private readonly auth           = inject(AuthService);
  private readonly eventosService = inject(EventosService);
  private readonly financeService = inject(FinanceService);
  readonly t = this.i18n.t;

  private readonly _today = new Date();

  readonly diaSeleccionado = signal<Date>(new Date());
  readonly mesCalendario   = signal({ anyo: this._today.getFullYear(), mes: this._today.getMonth() });

  readonly userName = computed(() => this.auth.user()?.name ?? '');
  readonly eventos  = this.eventosService.eventos;

  constructor() {
    this.eventosService.loadEventos();
    this.financeService.loadTransactions().subscribe();
    this.financeService.loadSavingsGoals().subscribe();
  }

  readonly fechaHoy = computed(() =>
    this._today.toLocaleDateString(this.i18n.locale(), {
      weekday: 'long', day: 'numeric', month: 'long',
    })
  );

  readonly eventosHoy = computed(() => {
    const t = this._today;
    return this.eventos().filter(e =>
      e.fecha.getDate()     === t.getDate()     &&
      e.fecha.getMonth()    === t.getMonth()    &&
      e.fecha.getFullYear() === t.getFullYear()
    );
  });

  readonly eventosDelMes = computed((): Evento[] => {
    const { anyo, mes } = this.mesCalendario();
    return this.eventos()
      .filter(e => e.fecha.getFullYear() === anyo && e.fecha.getMonth() === mes)
      .sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
  });

  readonly currentMonthStats = computed(() => {
    const label = this._today.toLocaleString('en-US', { month: 'short' });
    return this.financeService.monthlyStats().find(s => s.month === label) ?? null;
  });

  readonly recentTransactions = computed(() =>
    this.financeService.transactions().slice(0, 3)
  );

  readonly eventoLabel = (ev: Evento): string => {
    const hoy   = this._today;
    const esHoy =
      ev.fecha.getDate()     === hoy.getDate()     &&
      ev.fecha.getMonth()    === hoy.getMonth()    &&
      ev.fecha.getFullYear() === hoy.getFullYear();

    const fecha = esHoy
      ? ''
      : ev.fecha.toLocaleDateString(this.i18n.locale(), { day: 'numeric', month: 'short' });

    return [fecha, ev.hora].filter(Boolean).join(' · ');
  };

  onDiaSeleccionado(fecha: Date): void { this.diaSeleccionado.set(fecha); }
  onMesVisibleChange(val: { anyo: number; mes: number }): void { this.mesCalendario.set(val); }
}
