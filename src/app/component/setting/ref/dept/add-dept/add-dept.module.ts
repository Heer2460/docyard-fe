import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AddDeptComponent} from './add-dept.component';
import {AddDeptRoutingModule} from "./add-dept-routing.module";
import {LayoutModule} from "../../../../layout/layout.module";


@NgModule({
    declarations: [
        AddDeptComponent
    ],
    imports: [
        CommonModule,
        AddDeptRoutingModule,
        LayoutModule
    ]
})
export class AddDeptModule {
}
