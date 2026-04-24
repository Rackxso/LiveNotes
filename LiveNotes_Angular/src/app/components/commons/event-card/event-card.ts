import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Evento } from '../../../model/evento.model';

@Component({
  selector: 'app-event-card',
  imports: [],
  templateUrl: './event-card.html',
  styleUrl: './event-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(click)': 'clicked.emit(evento())' },
})
export class EventCard {
  readonly evento = input.required<Evento>();
  readonly clicked = output<Evento>();
}