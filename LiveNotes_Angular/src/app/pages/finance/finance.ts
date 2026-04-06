import { Component, signal } from '@angular/core';
import { Header } from '../../components/header/header';
import { MoneyCard } from '../../components/commons/money-card/money-card';
import { GoalProgress } from '../../components/commons/goal-progress/goal-progress';

@Component({
  selector: 'app-finance',
  imports: [Header, MoneyCard, GoalProgress],
  templateUrl: './finance.html',
  styleUrl: './finance.css',
})
export class Finance {
  public vistasPage = signal<string[]>(['Overview', 'Transactions', 'Savings']);
  public vistaActual = signal<string>('Month');

  public nombreVista = signal<string>("Finnances");

  onVistaSeleccionada(vista: string): void {
    this.vistaActual.set(vista);
  }
}
