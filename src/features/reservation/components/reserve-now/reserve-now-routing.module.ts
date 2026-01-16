import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReserveNowComponent } from './reserve-now.component';
import { FoodPackageComponent } from '../food-package/food-package.component';
import { CustomMenuComponent } from '../custom-menu/custom-menu.component';
import { ConfirmComponent } from '../confirm/confirm.component';


const routes: Routes = [
  { path: 'reserve-now', component: ReserveNowComponent },
  { path: 'food-package', component: FoodPackageComponent },
  { path: 'custom-menu', component: CustomMenuComponent },
  { path: 'confirm', component: ConfirmComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReserveNowRoutingModule { }
