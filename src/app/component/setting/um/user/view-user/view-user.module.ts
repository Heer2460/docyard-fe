import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewUserRoutingModule } from './view-user-routing.module';
import { ViewUserComponent } from './view-user.component';
import {LayoutModule} from "../../../../layout/layout.module";
import {CustomDirectiveModule} from "../../../../../shared/directive/custom.directive.module";
import {BreadcrumbModule} from "../../../../layout/breadcrumb/breadcrumb.module";


@NgModule({
  declarations: [
    ViewUserComponent
  ],
    imports: [
        CommonModule,
        ViewUserRoutingModule,
        LayoutModule,
        CustomDirectiveModule,
        BreadcrumbModule
    ]
})
export class ViewUserModule { }
