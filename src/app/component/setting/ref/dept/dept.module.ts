import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DeptComponent} from './dept.component';
import {DeptRoutingModule} from "./dept-routing.module";
import {TableModule} from "primeng/table";
import {TieredMenuModule} from "primeng/tieredmenu";
import {DialogModule} from "primeng/dialog";
import {LayoutModule} from "../../../layout/layout.module";
import {ConfirmDialogModule} from "primeng/confirmdialog";

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
        ConfirmDialogModule
    ]
})
export class DeptModule {
}
