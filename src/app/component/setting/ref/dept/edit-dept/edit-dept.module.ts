import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditDeptComponent} from './edit-dept.component';
import {EditDeptRoutingModule} from "./edit-dept-routing.module";
import {LayoutModule} from "../../../../layout/layout.module";


@NgModule({
    declarations: [
        EditDeptComponent
    ],
    imports: [
        CommonModule,
        EditDeptRoutingModule,
        LayoutModule
    ]
})
export class EditDeptModule {
}
