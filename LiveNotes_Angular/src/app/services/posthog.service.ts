import { Injectable, NgZone, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import posthog from 'posthog-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PosthogService {
  private readonly ngZone = inject(NgZone);
  private readonly router = inject(Router);

  constructor() {
    this.ngZone.runOutsideAngular(() => {
      posthog.init(environment.posthogKey, {
        api_host: environment.posthogHost,
        defaults: '2025-05-24',
        capture_pageview: false,
      });

      this.router.events.pipe(
        filter(e => e instanceof NavigationEnd)
      ).subscribe(e => {
        posthog.capture('$pageview', { $current_url: (e as NavigationEnd).urlAfterRedirects });
      });
    });
  }

  capture(event: string, properties?: Record<string, unknown>): void {
    posthog.capture(event, properties);
  }

  identify(userId: string, properties?: Record<string, unknown>): void {
    posthog.identify(userId, properties);
  }

  reset(): void {
    posthog.reset();
  }
}
