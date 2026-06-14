import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { DashboardComponent } from './app/pages/dashboard/dashboard.component';
import { authGuard } from '@/guards/auth-guard';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            { path: '', component: DashboardComponent },
            { path: 'cards', loadChildren: () => import('./app/pages/cards/cards.routes') },
            { path: 'transactions', loadChildren: () => import('./app/pages/transactions/transactions.routes') },
            { path: 'categories', loadChildren: () => import('./app/pages/categories/categories.routes') }
        ]
    },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
