import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeRoutingModule} from "./home-routing.module";
import {HomeComponent} from "./home.component";
import {BreadcrumbModule} from "../layout/breadcrumb/breadcrumb.module";
import {TieredMenuModule} from "primeng/tieredmenu";
import {LayoutModule} from "../layout/layout.module";
import {GridItemModule} from "../shared/grid-item/grid-item.module";

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        BreadcrumbModule,
        TieredMenuModule,
        LayoutModule,
        GridItemModule
    ]
})
export class HomeModule {
}
