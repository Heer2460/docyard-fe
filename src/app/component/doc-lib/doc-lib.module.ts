import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DocLibRoutingModule} from "./doc-lib-routing.module";
import {DocLibComponent} from "./doc-lib.component";
import {BreadcrumbModule} from "../layout/breadcrumb/breadcrumb.module";
import {TieredMenuModule} from "primeng/tieredmenu";
import {LayoutModule} from "../layout/layout.module";
import {DataTableModule} from "../shared/data-table/data-table.module";
import {DocInfoPaneModule} from "./doc-info-pane/doc-info-pane.module";

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
        DataTableModule,
        DocInfoPaneModule
    ]
})
export class DocLibModule {
}
