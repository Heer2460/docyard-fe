import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditRoleRoutingModule } from './edit-role-routing.module';
import {EditRoleComponent} from "./edit-role.component";


@NgModule({
  declarations: [
    EditRoleComponent
  ],
  imports: [
    CommonModule,
    EditRoleRoutingModule
  ]
})
export class EditRoleModule { }
