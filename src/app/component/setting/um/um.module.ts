import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UmRoutingModule} from "./um-routing.module";
import {UmComponent} from './um.component';
import {LayoutModule} from "../../layout/layout.module";


@NgModule({
    declarations: [
        UmComponent
    ],
    imports: [
        CommonModule,
        UmRoutingModule,
        LayoutModule
    ]
})
export class UmModule {
}
