import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShareByMeRoutingModule} from "./share-by-me-routing.module";
import {ShareByMeComponent} from "./share-by-me.component";
import {TieredMenuModule} from "primeng/tieredmenu";
import {LayoutModule} from "../layout/layout.module";
import {SbmDocInfoPaneModule} from "./doc-info-pane/sbm-doc-info-pane.module";
import {DialogModule} from "primeng/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ChipsModule} from "primeng/chips";
import {DropdownModule} from "primeng/dropdown";
import {CheckboxModule} from "primeng/checkbox";
import {CalendarModule} from "primeng/calendar";
import {CustomDirectiveModule} from "../../shared/directive/custom.directive.module";

@NgModule({
    declarations: [
        ShareByMeComponent
    ],
    imports: [
        CommonModule,
        ShareByMeRoutingModule,
        TieredMenuModule,
        LayoutModule,
        SbmDocInfoPaneModule,
        DialogModule,
        ReactiveFormsModule,
        TableModule,
        ConfirmDialogModule,
        ChipsModule,
        FormsModule,
        DropdownModule,
        CheckboxModule,
        CalendarModule,
        CustomDirectiveModule
    ]
})
export class ShareByMeModule {
}
