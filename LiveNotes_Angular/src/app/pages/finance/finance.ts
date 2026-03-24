import { Component, signal } from '@angular/core';
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-finance',
  imports: [Header],
  templateUrl: './finance.html',
  styleUrl: './finance.css',
})
export class Finance {
  public vistasPage = signal<string[]>(['Overview', 'Transactions', 'Savings']);
  public vistaActual = signal<string>('Month');

  onVistaSeleccionada(vista: string): void {
    this.vistaActual.set(vista);
  }
}
