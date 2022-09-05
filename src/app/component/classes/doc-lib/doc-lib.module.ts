import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DocLibRoutingModule} from "./doc-lib-routing.module";
import {DocLibComponent} from "./doc-lib.component";
import {BreadcrumbModule} from "../layout/breadcrumb/breadcrumb.module";
import {TieredMenuModule} from "primeng/tieredmenu";
import {LayoutModule} from "../layout/layout.module";

@NgModule({
    declarations: [
        DocLibComponent
    ],
    imports: [
        CommonModule,
        DocLibRoutingModule,
        BreadcrumbModule,
        TieredMenuModule,
        LayoutModule
    ]
})
export class DocLibModule {
}
