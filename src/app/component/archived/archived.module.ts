import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShareWithMeRoutingModule} from "./archived-routing.module";
import {ArchivedComponent} from "./archived.component";
import {TieredMenuModule} from "primeng/tieredmenu";
import {LayoutModule} from "../layout/layout.module";
import {ArDocInfoPaneModule} from "./doc-info-pane/ar-doc-info-pane.module";
import {DialogModule} from "primeng/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ChipsModule} from "primeng/chips";
import {DropdownModule} from "primeng/dropdown";
import {CheckboxModule} from "primeng/checkbox";
import {CalendarModule} from "primeng/calendar";
import {DocInfoPaneModule} from "../doc-lib/doc-info-pane/doc-info-pane.module";
import {CustomDirectiveModule} from "../../shared/directive/custom.directive.module";

@NgModule({
    declarations: [
        ArchivedComponent
    ],
    imports: [
        CommonModule,
        ShareWithMeRoutingModule,
        TieredMenuModule,
        LayoutModule,
        ArDocInfoPaneModule,
        DialogModule,
        ReactiveFormsModule,
        TableModule,
        ConfirmDialogModule,
        ChipsModule,
        FormsModule,
        DropdownModule,
        CheckboxModule,
        CalendarModule,
        CustomDirectiveModule,
    ]
})
export class ArchivedModule {
}
