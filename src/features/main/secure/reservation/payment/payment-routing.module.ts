import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentComponent } from './payment.component';
import { GcashComponent } from './components/gcash/gcash.component';
import { MayaComponent } from './components/maya/maya.component';


const routes: Routes = [
  { path: '', component: PaymentComponent },
  { path: 'gcash', component: GcashComponent },
  { path: 'maya', component: MayaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }