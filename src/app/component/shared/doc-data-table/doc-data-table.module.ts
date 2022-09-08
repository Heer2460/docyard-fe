import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DocDataTableComponent} from "./doc-data-table.component";
import {TableModule} from "primeng/table";
import {TieredMenuModule} from "primeng/tieredmenu";
import {GridItemModule} from "../grid-item/grid-item.module";

@NgModule({
    declarations: [
        DocDataTableComponent
    ],
    exports: [
        DocDataTableComponent
    ],
    imports: [
        CommonModule,
        TableModule,
        TieredMenuModule,
        GridItemModule
    ]
})
export class DocDataTableModule {
}
