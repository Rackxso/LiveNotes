import { Injectable, signal } from '@angular/core';
import { Evento } from '../model/evento.model.js';

@Injectable({ providedIn: 'root' })
export class EventosService {
  private readonly _eventos = signal<Evento[]>([
    { id: 1, titulo: 'Movie night', descripcion: 'Buy snack on the way home', fecha: new Date(2026, 3, 12), hora: '21:00' },
    { id: 2, titulo: 'Pharma meeting', fecha: new Date(2026, 3, 13), hora: '11:00' },
    { id: 3, titulo: 'Dentist', descripcion: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been ....', fecha: new Date(2026, 3, 13), hora: '16:00' },
    { id: 4, titulo: 'Client Meeting', fecha: new Date(2026, 3, 18), hora: '10:00' },
    { id: 5, titulo: 'Movie night', fecha: new Date(2026, 3, 6), hora: '21:00' },
    { id: 6, titulo: 'Pharma proposal review', fecha: new Date(2026, 3, 20), hora: '08:00' },
    { id: 7, titulo: 'Proyect 2 Deadline', fecha: new Date(2026, 3, 20) },
    { id: 8, titulo: "Office's dinner", fecha: new Date(2026, 3, 27), hora: '19:00' },
    { id: 9, titulo: 'Friends meeting', fecha: new Date(2026, 3, 27) },
    { id: 10, titulo: 'Proyect 1 Deadline', fecha: new Date(2026, 3, 4) },
    { id: 11, titulo: 'Lunch with Sara', fecha: new Date(2026, 3, 1), hora: '13:00' },
  ]);


  readonly eventos = this._eventos.asReadonly();
}