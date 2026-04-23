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

export interface AdminTicket extends Ticket {
  usuario: { _id: string; name: string; email: string };
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

  getAllAdmin() {
    return this.http.get<AdminTicket[]>(`${this.base}/admin`);
  }

  deleteAdmin(id: string) {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }

  updateEstado(id: string, estado: AdminTicket['estado']) {
    return this.http.patch<AdminTicket>(`${this.base}/${id}/estado`, { estado });
  }
}
