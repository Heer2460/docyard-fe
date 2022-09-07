import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserComponent } from './add-user.component';
import {LayoutModule} from "../../../layout/layout.module";
import {AddUserRoutingModule} from "./add-user-routing.module";



@NgModule({
  declarations: [
    AddUserComponent
  ],
    imports: [
        CommonModule,
        AddUserRoutingModule,
        LayoutModule
    ]
})
export class AddUserModule { }
