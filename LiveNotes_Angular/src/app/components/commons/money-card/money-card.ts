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
  readonly amount  = input<string>('0,00');
  readonly pct     = input<string>('0 %');
  readonly pctUp   = input<boolean>(true);
  readonly variant = input<'green' | 'red' | 'blue'>('green');
}
