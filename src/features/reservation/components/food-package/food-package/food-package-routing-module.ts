import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FoodPackageComponent } from '../food-package.component';

const routes: Routes = [{path: 'food-package', component: FoodPackageComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FoodPackageRoutingModule { }
