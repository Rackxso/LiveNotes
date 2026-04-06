import { Component, Input } from '@angular/core';
import { EventCard } from '../commons/event-card/event-card';
import { Evento } from '../../model/evento.model';
import { CommonModule } from '@angular/common';
import { EventsTitlePipe } from '../../events-title-pipe-pipe';

@Component({
  selector: 'app-eventos',
  imports: [EventCard, CommonModule, EventsTitlePipe],
  templateUrl: './eventos.html',
  styleUrl: './eventos.css',
})
export class Eventos {
  @Input() diaSeleccionado!: Date;
  @Input() eventosDia!: Evento[];
  @Input() eventosSemana!: Evento[];
  @Input() eventosMes!: Evento[];

  ngOnInit(){
    console.log(this.eventosDia);
  }
}
