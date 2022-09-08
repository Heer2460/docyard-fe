import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserComponent} from './user.component';
import {UserRoutingModule} from "./user-routing.module";
import {TableModule} from "primeng/table";
import {TieredMenuModule} from "primeng/tieredmenu";
import {DialogModule} from "primeng/dialog";
import {LayoutModule} from "../../../layout/layout.module";

@NgModule({
    declarations: [
        UserComponent
    ],
    imports: [
        CommonModule,
        UserRoutingModule,
        LayoutModule,
        TableModule,
        TieredMenuModule,
        DialogModule
    ]
})
export class UserModule {
}
