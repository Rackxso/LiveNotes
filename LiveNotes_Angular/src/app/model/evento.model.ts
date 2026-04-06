export interface Evento {
  id: number;
  titulo: string;
  descripcion?: string;
  fecha: Date;       // fecha completa del evento
  hora?: string;     // e.g. '21:00'
}