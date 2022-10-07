import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewRoleRoutingModule } from './view-role-routing.module';
import { ViewRoleComponent } from './view-role.component';
import {LayoutModule} from "../../../../layout/layout.module";
import {AccordionModule} from "primeng/accordion";
import {FormsModule} from "@angular/forms";
import {BreadcrumbModule} from "../../../../layout/breadcrumb/breadcrumb.module";


@NgModule({
  declarations: [
    ViewRoleComponent
  ],
    imports: [
        CommonModule,
        ViewRoleRoutingModule,
        LayoutModule,
        AccordionModule,
        FormsModule,
        BreadcrumbModule
    ]
})
export class ViewRoleModule { }
