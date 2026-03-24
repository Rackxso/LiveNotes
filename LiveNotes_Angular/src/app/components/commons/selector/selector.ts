import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-selector',
  imports: [],
  templateUrl: './selector.html',
  styleUrl: './selector.css',
})
export class Selector {
  @Input() vistas: string[] = [];
  @Output() vistaSeleccionada = new EventEmitter<string>();

  cambiarvista(event: Event): void {
    document.querySelectorAll('.menu div').forEach((element) => {
      element.classList.remove('active');
    });
    const el = event?.target as HTMLElement;
    el?.classList.add('active');
    this.vistaSeleccionada.emit(el?.innerText.trim());
  }
}