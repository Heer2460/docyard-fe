import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeRoutingModule} from "./home-routing.module";
import {HomeComponent} from "./home.component";
import {TieredMenuModule} from "primeng/tieredmenu";
import {LayoutModule} from "../layout/layout.module";
import {DialogModule} from "primeng/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DropdownModule} from "primeng/dropdown";
import {ChipsModule} from "primeng/chips";

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        TieredMenuModule,
        LayoutModule,
        DialogModule,
        ReactiveFormsModule,
        ConfirmDialogModule,
        DropdownModule,
        ChipsModule,
    ]
})
export class HomeModule {
}
