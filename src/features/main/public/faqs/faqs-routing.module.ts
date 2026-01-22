import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FAQsComponents } from './faqs.component';

const routes: Routes = [{ path: '', component: FAQsComponents }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaqsRoutingModule { }
