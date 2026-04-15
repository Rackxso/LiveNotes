import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        loadComponent: () => import('./pages/home/home').then(m => m.Home)
    },
    {
        path: "calendar/month",
        loadComponent: () => import('./pages/calendarPage/calendarPage').then(m => m.CalendarPage)
    },
    {
        path: "calendar/week",
        loadComponent: () => import('./pages/calendarPage/calendarPage').then(m => m.CalendarPage)
    },
    {
        path: "calendar/day",
        loadComponent: () => import('./pages/calendarPage/calendarPage').then(m => m.CalendarPage)
    },
    {
        path: "notes",
        loadComponent: () => import('./pages/notes/notes').then(m => m.Notes)
    },
    {
        path: "finance",
        redirectTo: "finance/overview",
        pathMatch: "full"
    },
    {
        path: "finance/overview",
        loadComponent: () => import('./pages/finance/finance').then(m => m.Finance)
    },
    {
        path: "finance/transactions",
        loadComponent: () => import('./pages/finance/finance').then(m => m.Finance)
    },
    {
        path: "finance/savings",
        loadComponent: () => import('./pages/finance/finance').then(m => m.Finance)
    }
];
