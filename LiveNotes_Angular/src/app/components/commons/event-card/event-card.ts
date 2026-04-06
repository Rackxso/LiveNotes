import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Evento } from '../../../model/evento.model';

@Component({
  selector: 'app-event-card',
  imports: [],
  templateUrl: './event-card.html',
  styleUrl: './event-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCard {
  readonly evento = input.required<Evento>();
}