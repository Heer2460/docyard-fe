import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DataTableComponent} from "./data-table.component";
import {TableModule} from "primeng/table";
import {TieredMenuModule} from "primeng/tieredmenu";

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
        TieredMenuModule
    ]
})
export class DataTableModule {
}
