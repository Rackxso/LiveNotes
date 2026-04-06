import { Component, computed, inject, signal } from '@angular/core';
import { Header } from '../../components/header/header';
import { Calendar } from '../../components/calendar/calendar';
import { Eventos } from '../../components/eventos/eventos';
import { EventosService } from '../../services/eventos.service';
import { Evento } from '../../model/evento.model';

@Component({
  selector: 'app-calendar-page',
  imports: [Header, Calendar, Eventos],
  templateUrl: './calendarPage.html',
  styleUrl: './calendarPage.css',
})
export class CalendarPage {
  private readonly eventosService = inject(EventosService);

  public vistasPage = signal<string[]>(['Month', 'Week', 'Day']);
  public vistaActual = signal<string>('Month');
  public primaryButton = signal<{ texto: string; url: string }>({ texto: 'Add Event', url: '#' });
  public secondaryButton = signal<{ texto: string; url: string }>({ texto: 'Today', url: '#' });
  public nombreVista = signal<string>('Calendar');
  public buttons = signal<boolean>(true);

  // Día seleccionado (por defecto hoy)
  public diaSeleccionado = signal<Date>(new Date());

  // Todos los eventos del servicio
  readonly eventos = this.eventosService.eventos;

  // Eventos del día seleccionado
  readonly eventosDia = computed(() => {
    const sel = this.diaSeleccionado();
    return this.eventos().filter(e =>
      e.fecha.getDate() === sel.getDate() &&
      e.fecha.getMonth() === sel.getMonth() &&
      e.fecha.getFullYear() === sel.getFullYear()
    );
  });

  // Inicio y fin de la semana del día seleccionado
  private readonly semana = computed(() => {
    const sel = this.diaSeleccionado();
    const inicio = new Date(sel);
    inicio.setDate(sel.getDate() - sel.getDay());
    const fin = new Date(inicio);
    fin.setDate(inicio.getDate() + 6);
    return { inicio, fin };
  });

  // Eventos de la semana (excluye los del día)
  readonly eventosSemana = computed(() => {
    const { inicio, fin } = this.semana();
    const sel = this.diaSeleccionado();
    return this.eventos().filter(e => {
      const enSemana = e.fecha >= inicio && e.fecha <= fin;
      const esDia = e.fecha.getDate() === sel.getDate() &&
                    e.fecha.getMonth() === sel.getMonth() &&
                    e.fecha.getFullYear() === sel.getFullYear();
      return enSemana && !esDia;
    });
  });

  // Eventos del mes (excluye los de la semana)
  readonly eventosMes = computed(() => {
    const { inicio, fin } = this.semana();
    const sel = this.diaSeleccionado();
    return this.eventos().filter(e =>
      e.fecha.getMonth() === sel.getMonth() &&
      e.fecha.getFullYear() === sel.getFullYear() &&
      !(e.fecha >= inicio && e.fecha <= fin)
    );
  });

  onVistaSeleccionada(vista: string): void {
    this.vistaActual.set(vista);
  }

  onPrimaryClicked(): void {}

  onDiaSeleccionado(fecha: Date): void {
    this.diaSeleccionado.set(fecha);
  }
}
