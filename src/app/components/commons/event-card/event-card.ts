import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Evento } from '../../../model/evento.model';
import { I18nService } from '../../../services/i18n.service';

@Component({
  selector: 'app-event-card',
  imports: [DatePipe],
  templateUrl: './event-card.html',
  styleUrl: './event-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(click)': 'clicked.emit(evento())' },
})
export class EventCard {
  private readonly i18n = inject(I18nService);
  readonly locale = this.i18n.locale;

  readonly evento = input.required<Evento>();
  readonly mostrarFecha = input<boolean>(false);
  readonly clicked = output<Evento>();
}