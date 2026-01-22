import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./home/home-module').then(m => m.HomeModule)
    },
    {
        path: 'about',
        loadChildren: () => import('./about/about-module').then(m => m.AboutModule)
    },
    {
        path: 'menu',
        loadChildren: () => import('./menu/menu-module').then(m => m.MenuModule)
    },
    {
        path: 'contact',
        loadChildren: () => import('./contact/contact-module').then(m => m.ContactModule)
    },
    {
        path: 'faqs',
        loadChildren: () => import('./faqs/faqs-module').then(m => m.FaqsModule)
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PublicRoutingModule { }
