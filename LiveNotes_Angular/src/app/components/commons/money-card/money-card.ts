import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component} from '@angular/core';

@Component({
  selector: 'app-money-card',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './money-card.html',
  styleUrl: './money-card.css',
})
export class MoneyCard {}
