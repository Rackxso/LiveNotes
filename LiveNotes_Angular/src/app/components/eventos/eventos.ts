import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { EventCard } from '../commons/event-card/event-card';
import { Evento } from '../../model/evento.model';
import { CommonModule } from '@angular/common';
import { EventsTitlePipe } from '../../events-title-pipe-pipe';

@Component({
  selector: 'app-eventos',
  imports: [EventCard, CommonModule, EventsTitlePipe],
  templateUrl: './eventos.html',
  styleUrl: './eventos.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Eventos {
  readonly diaSeleccionado = input.required<Date>();
  readonly eventosDia = input<Evento[]>([]);
  readonly eventosSemana = input<Evento[]>([]);
  readonly eventosMes = input<Evento[]>([]);
  readonly addEventoDia = output<void>();
}