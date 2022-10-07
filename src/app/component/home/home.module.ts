import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeRoutingModule} from "./home-routing.module";
import {HomeComponent} from "./home.component";
import {BreadcrumbModule} from "../layout/breadcrumb/breadcrumb.module";
import {TieredMenuModule} from "primeng/tieredmenu";
import {LayoutModule} from "../layout/layout.module";

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
    ]
})
export class HomeModule {
}
