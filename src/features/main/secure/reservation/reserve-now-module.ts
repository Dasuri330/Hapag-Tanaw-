import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ReserveNowRoutingModule } from './reserve-now-routing.module';
import { ReserveNowComponent } from './reserve-now.component';
import { FoodPackageComponent } from './components/food-package/food-package.component';
import { CustomMenuComponent } from './components/custom-menu/custom-menu.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { FoodPackageService } from '@shared/components/services/food-package.service';

@NgModule({
  declarations: [],  
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReserveNowRoutingModule,
    ReserveNowComponent,
    FoodPackageComponent,
    CustomMenuComponent,
    ConfirmComponent
  ],
  providers: [
    FoodPackageService
  ]
})
export class ReserveNowModule { }