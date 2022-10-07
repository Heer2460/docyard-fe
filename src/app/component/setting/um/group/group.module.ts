import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutModule} from "../../../layout/layout.module";
import {TableModule} from "primeng/table";
import {TieredMenuModule} from "primeng/tieredmenu";
import {DialogModule} from "primeng/dialog";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ReactiveFormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {GroupRoutingModule} from "./group-routing.module";
import {GroupComponent} from "./group.component";
import {MultiSelectModule} from "primeng/multiselect";


@NgModule({
    declarations: [
        GroupComponent
    ],
    imports: [
        CommonModule,
        GroupRoutingModule,
        LayoutModule,
        TableModule,
        TieredMenuModule,
        DialogModule,
        ConfirmDialogModule,
        ReactiveFormsModule,
        DropdownModule,
        MultiSelectModule,
    ]
})
export class GroupModule {
}
