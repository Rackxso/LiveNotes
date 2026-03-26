import { Component } from '@angular/core';
import { EventCard } from '../commons/event-card/event-card';

@Component({
  selector: 'app-eventos',
  imports: [EventCard],
  templateUrl: './eventos.html',
  styleUrl: './eventos.css',
})
export class Eventos {}
