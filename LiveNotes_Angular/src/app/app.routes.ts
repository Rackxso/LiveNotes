import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "calendar",
        loadComponent: () => import('./pages/calendarPage/calendarPage').then(m => m.CalendarPage)
    },
    {
        path: "finance",
        loadComponent: () => import('./pages/finance/finance').then(m => m.Finance)
    }
];
