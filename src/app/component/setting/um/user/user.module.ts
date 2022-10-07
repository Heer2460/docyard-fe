import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserComponent} from './user.component';
import {UserRoutingModule} from "./user-routing.module";
import {TableModule} from "primeng/table";
import {TieredMenuModule} from "primeng/tieredmenu";
import {DialogModule} from "primeng/dialog";
import {LayoutModule} from "../../../layout/layout.module";
import {DropdownModule} from "primeng/dropdown";
import {ReactiveFormsModule} from "@angular/forms";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {CustomDirectiveModule} from "../../../../shared/directive/custom.directive.module";
import {BreadcrumbModule} from "../../../layout/breadcrumb/breadcrumb.module";

@NgModule({
    declarations: [
        UserComponent
    ],
    imports: [
        CommonModule,
        UserRoutingModule,
        LayoutModule,
        TableModule,
        TieredMenuModule,
        DialogModule,
        DropdownModule,
        ReactiveFormsModule,
        ConfirmDialogModule,
        CustomDirectiveModule,
        BreadcrumbModule
    ]
})
export class UserModule {
}
