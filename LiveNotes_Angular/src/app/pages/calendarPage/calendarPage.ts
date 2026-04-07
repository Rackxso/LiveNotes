import { Component, computed, inject, signal } from '@angular/core';
import { Header } from '../../components/header/header';
import { Calendar } from '../../components/calendar/calendar';
import { Eventos } from '../../components/eventos/eventos';
import { EventosService } from '../../services/eventos.service';
import { Evento } from '../../model/evento.model';
import { AddEventModal } from '../../components/commons/add-event-modal/add-event-modal';

@Component({
  selector: 'app-calendar-page',
  imports: [Header, Calendar, AddEventModal, Eventos],
  templateUrl: './calendarPage.html',
  styleUrl: './calendarPage.css',
})
export class CalendarPage {
  private readonly eventosService = inject(EventosService);

  public vistasPage = signal<string[]>(['Month', 'Week', 'Day']);
  public vistaActual = signal<string>('Month');
  public primaryButton = signal<{ texto: string; url: string }>({ texto: 'Add Event', url: '#' });
  public secondaryButton = signal<{ texto: string; url: string }>({ texto: 'Today', url: 'calendar' });
  public nombreVista = signal<string>('Calendar');
  public buttons = signal<boolean>(true);

  // Día seleccionado (por defecto hoy)
  public diaSeleccionado = signal<Date>(new Date());

  // Helper privado para normalizar fechas (sin hora)
  private readonly diaSeleccionadoFecha = computed(() => {
    const sel = this.diaSeleccionado();
    const d = new Date(sel);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // Todos los eventos del servicio
  readonly eventos = this.eventosService.eventos;

  // Eventos del día seleccionado
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

  // Eventos del mes (excluye los de la semana)
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

  onVistaSeleccionada(vista: string): void {
    this.vistaActual.set(vista);
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

  // Reemplazar el método vacío existente
  onPrimaryClicked(): void {
    this.abrirModalHeader();
  }

  onDiaSeleccionado(fecha: Date): void {
    this.diaSeleccionado.set(fecha);
  }


}
