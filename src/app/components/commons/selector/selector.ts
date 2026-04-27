import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-selector',
  imports: [],
  templateUrl: './selector.html',
  styleUrl: './selector.css',
})
export class Selector {
  @Input() vistas: string[] = [];
  @Input() vistaActiva: string | null = null;
  @Input() iconosList: string[] = [];
  @Output() vistaSeleccionada = new EventEmitter<string>();
  vistaActivaLocal: string | null = null;

  cambiarvista(vista: string): void {
    this.vistaActivaLocal = vista;
    this.vistaSeleccionada.emit(vista);
  }
}