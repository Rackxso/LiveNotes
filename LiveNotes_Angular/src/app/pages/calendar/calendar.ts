import { Component, signal } from '@angular/core';
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-calendar',
  imports: [Header],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class Calendar {
  public vistasPage = signal<string[]>(['Month', 'Week', 'Day']);
  public vistaActual = signal<string>('Month');

  public primaryButton = signal<{ texto: string; url: string }>({
    texto: 'Add Event',
    url: '#'
  });

  public veces = 0;

  public secondaryButton = signal<{ texto: string; url: string }>({
    texto: 'Today',
    url: '#'
  });

    onVistaSeleccionada(vista: string): void {
      this.vistaActual.set(vista);
    }

  onPrimaryClicked(): void {
      console.log('Botón primary clickado', ++this.veces);
    }
  }