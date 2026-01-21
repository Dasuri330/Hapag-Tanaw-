import { Routes } from '@angular/router';
import { AuthComponent } from 'features/auth/auth.component';
import { MainComponent } from 'features/main/main.component';

export const routes: Routes = [
    {
        path: 'auth',
        component: AuthComponent,
        loadChildren: () => import('../features/auth/auth-module').then(m => m.AuthModule)
    },
    {
        path: 'main',
        component: MainComponent, 
        loadChildren: () => import('../features/main/main.module').then(m => m.MainModule)
    },
    { path: '', redirectTo: 'main', pathMatch: 'full' },
    { path: '**', redirectTo: 'main' }
];