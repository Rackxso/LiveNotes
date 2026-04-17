import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonConfig } from '../../../model/primary-button.model';

@Component({
  selector: 'app-secondary-button',
  templateUrl: './secondary-button.html',
  styleUrl: './secondary-button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecondaryButton {
  private readonly router = inject(Router);
  readonly config = input<ButtonConfig>({ texto: '' });
  readonly disabled = input(false);
  readonly clicked = output<void>();

  handleClick(): void {
    this.clicked.emit();
    if (this.config().url) {
      this.router.navigateByUrl(`/${this.config().url}`);
    }
  }
}
