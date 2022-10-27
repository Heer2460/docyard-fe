import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PreviewComponent} from './preview.component';
import {PreviewRoutingModule} from "./preview-routing.module";
import {DocInfoPaneModule} from "../doc-info-pane/doc-info-pane.module";
import {NavModule} from "../../layout/nav/nav.module";
import {TieredMenuModule} from "primeng/tieredmenu";
import {DialogModule} from "primeng/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {ChipsModule} from "primeng/chips";
import {SwmDocInfoPaneModule} from "../../share-with-me/doc-info-pane/swm-doc-info-pane.module";

@NgModule({
    declarations: [
        PreviewComponent,
    ],
    imports: [
        CommonModule,
        PreviewRoutingModule,
        DocInfoPaneModule,
        NavModule,
        TieredMenuModule,
        DialogModule,
        ReactiveFormsModule,
        DropdownModule,
        ChipsModule,
        SwmDocInfoPaneModule,
    ]
})
export class PreviewModule {
}
