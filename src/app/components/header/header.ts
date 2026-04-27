import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Selector } from '../commons/selector/selector';
import { PrimaryButton } from '../commons/primary-button/primary-button';
import { SecondaryButton } from '../commons/secondary-button/secondary-button';

@Component({
  selector: 'app-header',
  imports: [Selector, PrimaryButton, SecondaryButton],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Input() vistasPage: string[] = [];
  @Input() vistaActiva: string | null = null;
  @Input() iconosList: string[] = [];
  @Output() vistaSeleccionada = new EventEmitter<string>();

  @Input() primaryButton: { texto: string; url: string } = { texto: '', url: '' };
  @Output() primaryClicked = new EventEmitter<void>();

  @Input() secondaryButton: { texto: string; url: string } = { texto: '', url: '' };
  @Output() secondaryClicked = new EventEmitter<void>();

  @Input() name: string;

  @Input() buttons: boolean = false;

  onVistaSeleccionada(vista: string): void {
    this.vistaSeleccionada.emit(vista);
  }
}