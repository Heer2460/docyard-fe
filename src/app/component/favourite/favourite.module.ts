import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FavouriteRoutingModule} from './favourite-routing.module';
import {FavouriteComponent} from './favourite.component';
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {TableModule} from "primeng/table";
import {TieredMenuModule} from "primeng/tieredmenu";
import {LayoutModule} from "../layout/layout.module";
import {DocInfoPaneModule} from "../doc-lib/doc-info-pane/doc-info-pane.module";
import {DialogModule} from "primeng/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {ChipsModule} from "primeng/chips";
import {CustomDirectiveModule} from "../../shared/directive/custom.directive.module";


@NgModule({
    declarations: [
        FavouriteComponent
    ],
    imports: [
        CommonModule,
        FavouriteRoutingModule,
        ConfirmDialogModule,
        TableModule,
        TieredMenuModule,
        LayoutModule,
        DocInfoPaneModule,
        DialogModule,
        ReactiveFormsModule,
        DropdownModule,
        ChipsModule,
        CustomDirectiveModule,
    ]
})
export class FavouriteModule {
}
