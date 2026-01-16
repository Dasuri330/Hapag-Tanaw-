import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('../features/home/home-module').then(m => m.HomeModule)
    },
    {
        path: '',
        loadChildren: () => import('../features/about/about-module').then(m => m.AboutModule)
    },
    {
        path: '',
        loadChildren: () => import('../features/menu/menu-module').then(m => m.MenuModule)
    },
    {
        path: '',
        loadChildren: () => import('../features/contact/contact-module').then(m => m.ContactModule)
    },
    {
        path: '',
        loadChildren: () => import('../features/payment/components/payment/payment.module').then(m => m.PaymentModule)
    },
    {
        path: '',
        loadChildren: () => import('../features/reservation/components/reserve-now/reserve-now-module').then(m => m.ReserveNowModule)
    },
    {
        path: '',
        loadChildren: () => import('../features/auth//components/auth-module').then(m => m.AuthModule)
    },
    {
        path: '',
        loadChildren: () => import('../features/faqs/faqs-module').then(m => m.FaqsModule)
    },

    { path: '**', redirectTo: '' }
];