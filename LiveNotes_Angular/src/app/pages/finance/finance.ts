import { Component, computed, inject, signal } from '@angular/core';
import { Header } from '../../components/header/header';
import { MoneyCard } from '../../components/commons/money-card/money-card';
import { GoalProgress } from '../../components/commons/goal-progress/goal-progress';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-finance',
  imports: [Header, MoneyCard, GoalProgress],
  templateUrl: './finance.html',
  styleUrl: './finance.css',
})
export class Finance {
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;

  public vistasPage = computed<string[]>(() => [
    this.t()('finance.views.overview'),
    this.t()('finance.views.transactions'),
    this.t()('finance.views.savings'),
  ]);

  public vistaActual = signal<string>('Overview');
  public nombreVista = computed(() => this.t()('finance.pageTitle'));

  onVistaSeleccionada(vista: string): void {
    this.vistaActual.set(vista);
  }
}
