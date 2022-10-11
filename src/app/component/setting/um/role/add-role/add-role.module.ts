import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddRoleRoutingModule } from './add-role-routing.module';
import {AddRoleComponent} from "./add-role.component";
import {LayoutModule} from "../../../../layout/layout.module";
import {AccordionModule} from "primeng/accordion";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ConfirmDialogModule} from "primeng/confirmdialog";

@NgModule({
  declarations: [
    AddRoleComponent
  ],
    imports: [
        CommonModule,
        AddRoleRoutingModule,
        LayoutModule,
        ConfirmDialogModule,
        AccordionModule,
        DropdownModule,
        ReactiveFormsModule,
        FormsModule,
    ]
})
export class AddRoleModule { }
