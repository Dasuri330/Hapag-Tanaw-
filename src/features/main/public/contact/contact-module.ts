import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactComponent } from './contact.component';
import { ContactRoutingModule } from './contact-routing-module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ContactRoutingModule,
    ContactComponent
  ]
})
export class ContactModule { }
