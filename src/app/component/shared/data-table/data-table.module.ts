import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DataTableComponent} from "./data-table.component";
import {TableModule} from "primeng/table";
import {TieredMenuModule} from "primeng/tieredmenu";
import {GridItemModule} from "../grid-item/grid-item.module";

@NgModule({
    declarations: [
        DataTableComponent
    ],
    exports: [
        DataTableComponent
    ],
    imports: [
        CommonModule,
        TableModule,
        TieredMenuModule,
        GridItemModule
    ]
})
export class DataTableModule {
}
