import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GridItemComponent} from "./grid-item.component";
import {TieredMenuModule} from "primeng/tieredmenu";


@NgModule({
    declarations: [
        GridItemComponent
    ],
    imports: [
        CommonModule,
        TieredMenuModule
    ],
    exports: [
        GridItemComponent
    ]
})
export class GridItemModule {
}
