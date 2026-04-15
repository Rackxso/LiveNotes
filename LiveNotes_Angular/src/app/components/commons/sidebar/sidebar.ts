import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { I18nService } from '../../../services/i18n.service';
import { LangSelector } from '../lang-selector/lang-selector';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
  exact?: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, LangSelector],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;

  expanded = signal(false);

  toggle() {
    this.expanded.update(v => !v);
  }

  readonly mainNav = computed<NavItem[]>(() => [
    { label: this.t()('nav.home'),     icon: 'fa-solid fa-house',          route: '/',               exact: true },
    { label: this.t()('nav.notes'),    icon: 'fa-solid fa-note-sticky',    route: '/notes',          badge: 3 },
    { label: this.t()('nav.calendar'), icon: 'fa-solid fa-calendar',       route: '/calendar/month' },
    { label: this.t()('nav.finances'), icon: 'fa-solid fa-hand-holding-dollar',        route: '/finance',        badge: 5 },
  ]);

  readonly secondaryNav = computed<NavItem[]>(() => [
    { label: this.t()('nav.settings'), icon: 'fa-solid fa-gear',            route: '/settings' },
    { label: this.t()('nav.help'),     icon: 'fa-solid fa-circle-question', route: '/help' },
  ]);
}
