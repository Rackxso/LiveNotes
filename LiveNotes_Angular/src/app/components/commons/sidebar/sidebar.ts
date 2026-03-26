import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface NavItem {
  label: string;
  icon: string; // clase de Font Awesome, e.g. 'fa-solid fa-calendar'
  route: string;
  badge?: number;
  exact?: boolean;  
}


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  expanded = signal(false);

  toggle() {
    this.expanded.update(v => !v);
  }



  mainNav: NavItem[] = [
    { label: 'Inicio', icon: 'fa-solid fa-house', route: '/', exact: true },
    { label: 'Notas', icon: 'fa-solid fa-note-sticky', route: '/notes', badge: 3 },
    { label: 'Calendario', icon: 'fa-solid fa-calendar', route: '/calendar' },
    { label: 'Mensajes', icon: 'fa-solid fa-message', route: '/finance', badge: 5 },
  ];

  secondaryNav: NavItem[] = [
    { label: 'Ajustes', icon: 'fa-solid fa-gear', route: '/settings' },
    { label: 'Ayuda', icon: 'fa-solid fa-circle-question', route: '/help' },
  ];
}