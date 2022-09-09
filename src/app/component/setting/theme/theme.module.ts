import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ThemeComponent} from './theme.component';
import {ThemeRoutingModule} from "./theme-routing.module";
import {LayoutModule} from "../../layout/layout.module";


@NgModule({
    declarations: [
        ThemeComponent
    ],
    imports: [
        CommonModule,
        ThemeRoutingModule,
        LayoutModule
    ]
})
export class ThemeModule {
}
