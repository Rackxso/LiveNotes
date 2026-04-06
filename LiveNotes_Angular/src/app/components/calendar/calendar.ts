import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { Evento } from '../../model/evento.model';

@Component({
  selector: 'app-calendar',
  imports: [],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Calendar {
  readonly diasSemana = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  private readonly today = new Date();

  // Inputs
  readonly eventos = input<Evento[]>([]);
  readonly diaSeleccionado = input<Date>(new Date());

  // Output
  readonly diaSeleccionadoChange = output<Date>();

  readonly anyo = signal<number>(this.today.getFullYear());
  readonly mes = signal<number>(this.today.getMonth());

  readonly nombreMes = computed(() =>
    new Date(this.anyo(), this.mes(), 1).toLocaleString('en-US', { month: 'long' })
  );

  private readonly diasEnMes = computed(() =>
    new Date(this.anyo(), this.mes() + 1, 0).getDate()
  );

  readonly offsetInicio = computed(() =>
    new Date(this.anyo(), this.mes(), 1).getDay()
  );

  readonly celdasVacias = computed(() =>
    Array<null>(this.offsetInicio()).fill(null)
  );

  readonly diasMes = computed(() =>
    Array.from({ length: this.diasEnMes() }, (_, i) => i + 1)
  );

  readonly esHoy = (dia: number): boolean =>
    dia === this.today.getDate() &&
    this.mes() === this.today.getMonth() &&
    this.anyo() === this.today.getFullYear();

  readonly esSeleccionado = (dia: number): boolean => {
    const sel = this.diaSeleccionado();
    return dia === sel.getDate() &&
      this.mes() === sel.getMonth() &&
      this.anyo() === sel.getFullYear();
  };

  /** Devuelve los eventos de un día concreto del mes visible */
  readonly eventosDeDia = (dia: number): Evento[] =>
    this.eventos().filter(e =>
      e.fecha.getDate() === dia &&
      e.fecha.getMonth() === this.mes() &&
      e.fecha.getFullYear() === this.anyo()
    );

  seleccionarDia(dia: number): void {
    this.diaSeleccionadoChange.emit(new Date(this.anyo(), this.mes(), dia));
  }

  irAlMesAnterior(): void {
    if (this.mes() === 0) { this.mes.set(11); this.anyo.update(a => a - 1); }
    else { this.mes.update(m => m - 1); }
  }

  irAlMesSiguiente(): void {
    if (this.mes() === 11) { this.mes.set(0); this.anyo.update(a => a + 1); }
    else { this.mes.update(m => m + 1); }
  }

  irAHoy(): void {
    this.mes.set(this.today.getMonth());
    this.anyo.set(this.today.getFullYear());
  }
}