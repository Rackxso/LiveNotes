import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonConfig } from '../../../model/primary-button.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-primary-button',
  imports: [],
  templateUrl: './primary-button.html',
  styleUrl: './primary-button.css',
})
export class PrimaryButton {
  @Input() config: ButtonConfig = { texto: '', url: '' };
  @Output() clicked = new EventEmitter<void>();
  constructor(private router: Router) {}
  click(): void {
    this.clicked.emit();
    this.router.navigateByUrl(`/${this.config.url}`);
  }
}