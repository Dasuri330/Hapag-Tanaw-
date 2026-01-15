import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentComponent } from './payment/payment.component';
import { GcashComponent } from '../gcash/gcash.component';
import { MayaComponent } from '../maya/maya.component';


const routes: Routes = [
  { path: 'payment', component: PaymentComponent },
  { path: 'gcash', component: GcashComponent },
  { path: 'maya', component: MayaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }