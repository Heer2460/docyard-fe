import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserComponent} from './user.component';
import {UserRoutingModule} from "./user-routing.module";
import {LayoutModule} from "../../layout/layout.module";
import {TableModule} from "primeng/table";
import {TieredMenuModule} from "primeng/tieredmenu";

@NgModule({
    declarations: [
        UserComponent
    ],
    imports: [
        CommonModule,
        UserRoutingModule,
        LayoutModule,
        TableModule,
        TieredMenuModule
    ]
})
export class UserModule {
}
