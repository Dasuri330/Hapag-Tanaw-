import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentComponent } from './payment.component';
import { GcashComponent } from '../gcash/gcash.component';
import { MayaComponent } from '../maya/maya.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PaymentRoutingModule,
    PaymentComponent,   
    GcashComponent,     
    MayaComponent       
  ]
})
export class PaymentModule { }