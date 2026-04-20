import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-money-card',
  imports: [],
  templateUrl: './money-card.html',
  styleUrl: './money-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoneyCard {
  readonly label   = input<string>('Balance');
  readonly amount  = input<number>(0);
  readonly pct     = input<string>('—');
  readonly pctUp   = input<boolean>(true);
  readonly variant = input<'green' | 'red' | 'blue'>('green');

  fmt(): string {
    return this.amount().toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
