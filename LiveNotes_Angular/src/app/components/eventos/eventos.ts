import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { EventCard } from '../commons/event-card/event-card';
import { Evento } from '../../model/evento.model';
import { CommonModule } from '@angular/common';
import { EventsTitlePipe } from '../../events-title-pipe-pipe';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-eventos',
  imports: [EventCard, CommonModule, EventsTitlePipe],
  templateUrl: './eventos.html',
  styleUrl: './eventos.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Eventos {
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;
  readonly locale = this.i18n.locale;

  readonly diaSeleccionado = input.required<Date>();
  readonly vista          = input<string>('Month');
  readonly eventosDia     = input<Evento[]>([]);
  readonly eventosSemana  = input<Evento[]>([]);
  readonly eventosMes     = input<Evento[]>([]);
  readonly addEventoDia       = output<void>();
  readonly eventoSeleccionado = output<Evento>();

  readonly eventCount = computed(() => {
    const n = this.eventosDia().length + this.eventosSemana().length + this.eventosMes().length;
    const key = n === 1 ? 'eventos.event_one' : 'eventos.event_other';
    return `${n} ${this.t()(key)}`;
  });
}
