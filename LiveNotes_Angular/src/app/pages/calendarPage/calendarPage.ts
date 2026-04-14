import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Header } from '../../components/header/header';
import { MonthView } from '../../components/month-view/month-view';
import { WeekView } from '../../components/week-view/week-view';
import { DayView } from '../../components/day-view/day-view';
import { Eventos } from '../../components/eventos/eventos';
import { EventosService } from '../../services/eventos.service';
import { Evento } from '../../model/evento.model';
import { AddEventModal } from '../../components/commons/add-event-modal/add-event-modal';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-calendar-page',
  imports: [Header, MonthView, WeekView, DayView, AddEventModal, Eventos],
  templateUrl: './calendarPage.html',
  styleUrl: './calendarPage.css',
})
export class CalendarPage {
  private readonly eventosService = inject(EventosService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;

  // Clave interna de vista (invariante al idioma, usada para routing)
  public vistaActual = signal<string>('Month');

  // Vistas traducidas para mostrar en el selector
  public vistasPage = computed<string[]>(() => [
    this.t()('calendar.views.month'),
    this.t()('calendar.views.week'),
    this.t()('calendar.views.day'),
  ]);

  // Vista activa traducida para que el Selector la marque correctamente
  public vistaActivaTraducida = computed(() => {
    const map: Record<string, string> = {
      Month: 'calendar.views.month',
      Week: 'calendar.views.week',
      Day: 'calendar.views.day',
    };
    return this.t()(map[this.vistaActual()] ?? 'calendar.views.month');
  });

  public primaryButton = computed(() => ({ texto: this.t()('calendar.addEvent'), url: '#' }));
  public secondaryButton = computed(() => ({ texto: this.t()('calendar.today'), url: 'calendar' }));
  public nombreVista = computed(() => this.t()('calendar.pageTitle'));
  public buttons = signal<boolean>(true);

  constructor() {
    this.route.url.subscribe(segments => {
      const lastIndex = segments.length - 1;
      const view = lastIndex >= 0 ? segments[lastIndex].path : undefined;
      this.vistaActual.set(this.urlViewToKey(view));
    });
  }

  private urlViewToKey(view: string | undefined): string {
    switch (view) {
      case 'week': return 'Week';
      case 'day':  return 'Day';
      default:     return 'Month';
    }
  }

  // Día seleccionado (por defecto hoy)
  public diaSeleccionado = signal<Date>(new Date());

  private readonly diaSeleccionadoFecha = computed(() => {
    const sel = this.diaSeleccionado();
    const d = new Date(sel);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  readonly eventos = this.eventosService.eventos;

  readonly eventosDia = computed(() => {
    const sel = this.diaSeleccionado();
    const hoy = this.diaSeleccionadoFecha();
    return this.eventos().filter(e => {
      const fecha = new Date(e.fecha);
      fecha.setHours(0, 0, 0, 0);
      return fecha >= hoy &&
        e.fecha.getDate() === sel.getDate() &&
        e.fecha.getMonth() === sel.getMonth() &&
        e.fecha.getFullYear() === sel.getFullYear();
    });
  });

  private readonly semana = computed(() => {
    const sel = this.diaSeleccionado();
    const inicio = new Date(sel);
    inicio.setDate(sel.getDate() - sel.getDay());
    const fin = new Date(inicio);
    fin.setDate(inicio.getDate() + 6);
    return { inicio, fin };
  });

  readonly eventosSemana = computed(() => {
    const { inicio, fin } = this.semana();
    const sel = this.diaSeleccionado();
    const hoy = this.diaSeleccionadoFecha();
    return this.eventos().filter(e => {
      const fecha = new Date(e.fecha);
      fecha.setHours(0, 0, 0, 0);
      const enSemana = e.fecha >= inicio && e.fecha <= fin;
      const esDia = e.fecha.getDate() === sel.getDate() &&
        e.fecha.getMonth() === sel.getMonth() &&
        e.fecha.getFullYear() === sel.getFullYear();
      return fecha >= hoy && enSemana && !esDia;
    });
  });

  readonly eventosMes = computed(() => {
    const { inicio, fin } = this.semana();
    const sel = this.diaSeleccionado();
    const hoy = this.diaSeleccionadoFecha();
    return this.eventos().filter(e => {
      const fecha = new Date(e.fecha);
      fecha.setHours(0, 0, 0, 0);
      return fecha >= hoy &&
        e.fecha.getMonth() === sel.getMonth() &&
        e.fecha.getFullYear() === sel.getFullYear() &&
        !(e.fecha >= inicio && e.fecha <= fin);
    });
  });

  onVistaSeleccionada(label: string): void {
    // Mapear la etiqueta traducida de vuelta a la clave interna
    const reverse: Record<string, string> = {
      [this.t()('calendar.views.month')]: 'Month',
      [this.t()('calendar.views.week')]:  'Week',
      [this.t()('calendar.views.day')]:   'Day',
    };
    const key = reverse[label] ?? 'Month';
    this.vistaActual.set(key);

    const view = key.toLowerCase();
    if (view === 'month' || view === 'week' || view === 'day') {
      queueMicrotask(() => {
        const urlSegments = this.route.snapshot.url;
        const lastIndex = urlSegments.length - 1;
        const currentView = lastIndex >= 0 ? urlSegments[lastIndex].path : undefined;
        if (currentView !== view) {
          this.router.navigate(['/calendar', view]);
        }
      });
    }
  }

  public modalAbierto = signal<boolean>(false);
  public fechaModal = signal<Date | null>(null);

  abrirModalHeader(): void {
    this.fechaModal.set(null);
    this.modalAbierto.set(true);
  }

  abrirModalDia(): void {
    this.fechaModal.set(this.diaSeleccionado());
    this.modalAbierto.set(true);
  }

  cerrarModal(): void {
    this.modalAbierto.set(false);
  }

  onGuardarEvento(evento: Omit<Evento, 'id'>): void {
    this.eventosService.addEvento(evento);
    this.cerrarModal();
  }

  onPrimaryClicked(): void {
    this.abrirModalHeader();
  }

  onDiaSeleccionado(fecha: Date): void {
    this.diaSeleccionado.set(fecha);
  }
}
