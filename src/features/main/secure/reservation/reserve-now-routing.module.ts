import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReserveNowComponent } from './reserve-now.component';
import { FoodPackageComponent } from './components/food-package/food-package.component';
import { CustomMenuComponent } from './components/custom-menu/custom-menu.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { authGuard } from 'features/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    component: ReserveNowComponent
  },
  {
    path: 'food-package',
    canActivate: [authGuard],
    component: FoodPackageComponent
  },
  {
    path: 'custom-menu',
    canActivate: [authGuard],
    component: CustomMenuComponent
  },
  {
    path: 'confirm',
    canActivate: [authGuard],
    component: ConfirmComponent
  },
  {
    path: 'payment',
    canActivate: [authGuard],
    loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReserveNowRoutingModule { }