import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DocLibRoutingModule} from "./doc-lib-routing.module";
import {DocLibComponent} from "./doc-lib.component";
import {BreadcrumbModule} from "../layout/breadcrumb/breadcrumb.module";
import {TieredMenuModule} from "primeng/tieredmenu";
import {LayoutModule} from "../layout/layout.module";
import {DocDataTableModule} from "../shared/doc-data-table/doc-data-table.module";
import {DocInfoPaneModule} from "./doc-info-pane/doc-info-pane.module";
import {DialogModule} from "primeng/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import {FileUploaderModule} from "./file-uploader/file-uploader.module";
import {ListingDisplayModule} from "../layout/listing-display/listing-display.module";

@NgModule({
    declarations: [
        DocLibComponent
    ],
    imports: [
        CommonModule,
        DocLibRoutingModule,
        BreadcrumbModule,
        TieredMenuModule,
        LayoutModule,
        DocDataTableModule,
        DocInfoPaneModule,
        DialogModule,
        ReactiveFormsModule,
        FileUploaderModule,
        ListingDisplayModule
    ]
})
export class DocLibModule {
}
