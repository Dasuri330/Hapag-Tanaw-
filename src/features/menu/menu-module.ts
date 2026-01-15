import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { MenuRoutingModule } from './menu-routing-module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MenuRoutingModule,
    MenuComponent
  ]
})
export class MenuModule { }
