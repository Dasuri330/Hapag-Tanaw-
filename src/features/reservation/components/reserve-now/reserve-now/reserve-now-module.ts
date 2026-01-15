import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReserveNowRoutingModule } from './reserve-now-routing-module';
import { ReserveNowComponent } from '../reserve-now.component';
import { FoodPackageComponent } from '../../food-package/food-package.component';
import { CustomMenuComponent } from '../../custom-menu/custom-menu.component';
import { ConfirmComponent } from '../../confirm/confirm.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReserveNowRoutingModule,
    ReserveNowComponent,
    FoodPackageComponent,
    CustomMenuComponent,
    ConfirmComponent

  ]
})
export class ReserveNowModule { }
