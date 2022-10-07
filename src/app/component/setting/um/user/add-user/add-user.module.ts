import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserComponent } from './add-user.component';
import {AddUserRoutingModule} from "./add-user-routing.module";
import {LayoutModule} from "../../../../layout/layout.module";
import {ReactiveFormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {CustomDirectiveModule} from "../../../../../shared/directive/custom.directive.module";
import {MultiSelectModule} from "primeng/multiselect";
import {BreadcrumbModule} from "../../../../layout/breadcrumb/breadcrumb.module";



@NgModule({
  declarations: [
    AddUserComponent
  ],
    imports: [
        CommonModule,
        AddUserRoutingModule,
        LayoutModule,
        ReactiveFormsModule,
        DropdownModule,
        CustomDirectiveModule,
        MultiSelectModule,
        BreadcrumbModule
    ]
})
export class AddUserModule { }
