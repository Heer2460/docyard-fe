import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddRoleRoutingModule } from './add-role-routing.module';
import {AddRoleComponent} from "./add-role.component";


@NgModule({
  declarations: [
    AddRoleComponent
  ],
  imports: [
    CommonModule,
    AddRoleRoutingModule
  ]
})
export class AddRoleModule { }
