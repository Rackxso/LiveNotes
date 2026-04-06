import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        loadComponent: () => import('./pages/home/home').then(m => m.Home)
    },
    {
        path: "calendar",
        loadComponent: () => import('./pages/calendarPage/calendarPage').then(m => m.CalendarPage)
    },
    {
        path: "notes",
        loadComponent: () => import('./pages/notes/notes').then(m => m.Notes)
    },
    {
        path: "finance",
        loadComponent: () => import('./pages/finance/finance').then(m => m.Finance)
    }
];
