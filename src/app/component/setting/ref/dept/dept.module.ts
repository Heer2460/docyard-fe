import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DeptComponent} from './dept.component';
import {DeptRoutingModule} from "./dept-routing.module";
import {TableModule} from "primeng/table";
import {TieredMenuModule} from "primeng/tieredmenu";
import {DialogModule} from "primeng/dialog";
import {LayoutModule} from "../../../layout/layout.module";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ReactiveFormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";

@NgModule({
    declarations: [
        DeptComponent
    ],
    imports: [
        CommonModule,
        DeptRoutingModule,
        LayoutModule,
        TableModule,
        TieredMenuModule,
        DialogModule,
        ConfirmDialogModule,
        ReactiveFormsModule,
        DropdownModule
    ]
})
export class DeptModule {
}
