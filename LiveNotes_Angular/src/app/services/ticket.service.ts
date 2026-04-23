import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface CreateTicketDto {
  asunto: string;
  categoria: 'bug' | 'sugerencia' | 'pregunta' | 'otro';
  descripcion: string;
}

export interface Ticket extends CreateTicketDto {
  _id: string;
  estado: 'abierto' | 'en_revision' | 'resuelto';
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/tickets`;

  create(dto: CreateTicketDto) {
    return this.http.post<Ticket>(this.base, dto);
  }

  getAll() {
    return this.http.get<Ticket[]>(this.base);
  }
}
