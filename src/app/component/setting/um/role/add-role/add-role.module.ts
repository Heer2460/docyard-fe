import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddRoleRoutingModule } from './add-role-routing.module';
import {AddRoleComponent} from "./add-role.component";
import {LayoutModule} from "../../../../layout/layout.module";
import {AccordionModule} from "primeng/accordion";


@NgModule({
  declarations: [
    AddRoleComponent
  ],
    imports: [
        CommonModule,
        AddRoleRoutingModule,
        LayoutModule,
        AccordionModule
    ]
})
export class AddRoleModule { }
