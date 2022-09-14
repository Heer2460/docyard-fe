import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewUserRoutingModule } from './view-user-routing.module';
import { ViewUserComponent } from './view-user.component';
import {LayoutModule} from "../../../../layout/layout.module";


@NgModule({
  declarations: [
    ViewUserComponent
  ],
    imports: [
        CommonModule,
        ViewUserRoutingModule,
        LayoutModule
    ]
})
export class ViewUserModule { }
