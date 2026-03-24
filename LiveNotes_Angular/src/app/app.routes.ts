import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        loadComponent: () => import('./pages/calendar/calendar').then(m => m.Calendar)
    },
    {
        path: "finance",
        loadComponent: () => import('./pages/finance/finance').then(m => m.Finance)
    }
];
