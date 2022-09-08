import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RefComponent} from './ref.component';
import {RefRoutingModule} from "./ref-routing.module";
import {LayoutModule} from "../../layout/layout.module";


@NgModule({
    declarations: [
        RefComponent
    ],
    imports: [
        CommonModule,
        RefRoutingModule,
        LayoutModule
    ]
})
export class RefModule {
}
