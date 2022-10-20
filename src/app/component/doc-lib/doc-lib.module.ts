import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DocLibRoutingModule} from "./doc-lib-routing.module";
import {DocLibComponent} from "./doc-lib.component";
import {TieredMenuModule} from "primeng/tieredmenu";
import {LayoutModule} from "../layout/layout.module";
import {DocInfoPaneModule} from "./doc-info-pane/doc-info-pane.module";
import {DialogModule} from "primeng/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ChipsModule} from "primeng/chips";
import {DropdownModule} from "primeng/dropdown";
import {CheckboxModule} from "primeng/checkbox";
import {CalendarModule} from "primeng/calendar";
import {TooltipModule} from "primeng/tooltip";

@NgModule({
    declarations: [
        DocLibComponent
    ],
    imports: [
        CommonModule,
        DocLibRoutingModule,
        TieredMenuModule,
        LayoutModule,
        DocInfoPaneModule,
        DialogModule,
        ReactiveFormsModule,
        TableModule,
        ConfirmDialogModule,
        ChipsModule,
        FormsModule,
        DropdownModule,
        CheckboxModule,
        CalendarModule,
        TooltipModule
    ]
})
export class DocLibModule {
}
