import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RoleRoutingModule} from './role-routing.module';
import {RoleComponent} from './role.component';
import {LayoutModule} from "../../../layout/layout.module";
import {TableModule} from "primeng/table";
import {TieredMenuModule} from "primeng/tieredmenu";
import {DialogModule} from "primeng/dialog";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ReactiveFormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {BreadcrumbModule} from "../../../layout/breadcrumb/breadcrumb.module";


@NgModule({
    declarations: [
        RoleComponent
    ],
    imports: [
        CommonModule,
        RoleRoutingModule,
        LayoutModule,
        TableModule,
        TieredMenuModule,
        DialogModule,
        ConfirmDialogModule,
        ReactiveFormsModule,
        DropdownModule,
        BreadcrumbModule
    ]
})
export class RoleModule {
}
