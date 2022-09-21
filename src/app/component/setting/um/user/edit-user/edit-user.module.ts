import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditUserRoutingModule } from './edit-user-routing.module';
import { EditUserComponent } from './edit-user.component';
import {LayoutModule} from "../../../../layout/layout.module";
import {TableModule} from "primeng/table";
import {ReactiveFormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {MultiSelectModule} from "primeng/multiselect";


@NgModule({
  declarations: [
    EditUserComponent
  ],
    imports: [
        CommonModule,
        EditUserRoutingModule,
        LayoutModule,
        TableModule,
        ReactiveFormsModule,
        DropdownModule,
        MultiSelectModule
    ]
})
export class EditUserModule { }
