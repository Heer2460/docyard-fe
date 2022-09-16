import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddRoleRoutingModule } from './add-role-routing.module';
import {AddRoleComponent} from "./add-role.component";
import {LayoutModule} from "../../../../layout/layout.module";
import {AccordionModule} from "primeng/accordion";
import {DropdownModule} from "primeng/dropdown";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    AddRoleComponent
  ],
    imports: [
        CommonModule,
        AddRoleRoutingModule,
        LayoutModule,
        AccordionModule,
        DropdownModule,
        ReactiveFormsModule
    ]
})
export class AddRoleModule { }