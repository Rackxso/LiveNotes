import { Component, signal } from '@angular/core';
import { Header } from '../../components/header/header';
import { Calendar } from '../../components/calendar/calendar';
import { Eventos } from '../../components/eventos/eventos';

@Component({
  selector: 'app-calendar-page',
  imports: [Header, Calendar, Eventos],
  templateUrl: './calendarPage.html',
  styleUrl: './calendarPage.css',
})


export class CalendarPage {
  public vistasPage = signal<string[]>(['Month', 'Week', 'Day']);
  public vistaActual = signal<string>('Month');

  public primaryButton = signal<{ texto: string; url: string }>({
    texto: 'Add Event',
    url: '#'
  });

  public nombreVista = signal<string>("Calendar");

  public veces = 0;

  public secondaryButton = signal<{ texto: string; url: string }>({
    texto: 'Today',
    url: '#'
  });

  public buttons = signal<boolean>(true);

    onVistaSeleccionada(vista: string): void {
      this.vistaActual.set(vista);
    }

  onPrimaryClicked(): void {
      console.log('Botón primary clickado', ++this.veces);
    }
  }