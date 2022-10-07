import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { UserProfileComponent } from './user-profile.component';
import {LayoutModule} from "../layout/layout.module";
import {GroupRoutingModule} from "../setting/um/group/group-routing.module";
import {TableModule} from "primeng/table";
import {TieredMenuModule} from "primeng/tieredmenu";
import {DialogModule} from "primeng/dialog";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ReactiveFormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {MultiSelectModule} from "primeng/multiselect";


@NgModule({
  declarations: [
    UserProfileComponent
  ],
    imports: [
        CommonModule,
        UserProfileRoutingModule,
        LayoutModule,
        CommonModule,
        GroupRoutingModule,
        LayoutModule,
        TableModule,
        TieredMenuModule,
        DialogModule,
        ConfirmDialogModule,
        ReactiveFormsModule,
        DropdownModule,
        MultiSelectModule,
    ]
})
export class UserProfileModule { }
