import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../auth/guards/auth.guard';

const routes: Routes = [
  {
    path: 'reservation',
    loadChildren: () => import('./reservation/reserve-now-module').then(m => m.ReserveNowModule),
    canActivate: [authGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecureRoutingModule { }