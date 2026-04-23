import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { PremiumService } from '../../../services/premium.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-paywall-modal',
  templateUrl: './paywall-modal.html',
  styleUrl: './paywall-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaywallModal {
  private readonly premium = inject(PremiumService);
  readonly auth = inject(AuthService);

  readonly closed = output<void>();

  readonly toggling = signal(false);

  private readonly dialogEl = viewChild.required<ElementRef<HTMLDialogElement>>('dialogEl');

  open(): void {
    this.dialogEl().nativeElement.showModal();
  }

  close(): void {
    this.dialogEl().nativeElement.close();
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialogEl().nativeElement) this.close();
  }

  // [STRIPE] Descomenta cuando Stripe esté activo
  // upgrade(): void {
  //   this.premium.createCheckoutSession();
  // }

  simulateToggle(): void {
    if (this.toggling()) return;
    this.toggling.set(true);
    this.premium.simulateToggle().subscribe({
      next: () => {
        this.toggling.set(false);
        this.close();
      },
      error: () => this.toggling.set(false),
    });
  }
}
