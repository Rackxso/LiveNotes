import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonConfig } from '../../../model/primary-button.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-secondary-button',
  imports: [],
  templateUrl: './secondary-button.html',
  styleUrl: './secondary-button.css',
})
export class SecondaryButton {
  @Input() config: ButtonConfig = { texto: '', url: '' };
  @Output() clicked = new EventEmitter<void>();
  constructor(private router: Router) {}
  click(): void {
    this.router.navigateByUrl(`/${this.config.url}`);
  }
}
