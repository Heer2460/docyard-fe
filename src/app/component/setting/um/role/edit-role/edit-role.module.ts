import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditRoleRoutingModule } from './edit-role-routing.module';
import {EditRoleComponent} from "./edit-role.component";
import {AccordionModule} from "primeng/accordion";
import {LayoutModule} from "../../../../layout/layout.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";


@NgModule({
  declarations: [
    EditRoleComponent
  ],
    imports: [
        CommonModule,
        EditRoleRoutingModule,
        AccordionModule,
        LayoutModule,
        ReactiveFormsModule,
        DropdownModule,
        FormsModule,
    ]
})
export class EditRoleModule { }
