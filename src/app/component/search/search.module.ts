import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SearchRoutingModule} from './search-routing.module';
import {SearchComponent} from './search.component';
import {TieredMenuModule} from "primeng/tieredmenu";
import {TableModule} from "primeng/table";
import {DialogModule} from "primeng/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
    declarations: [
        SearchComponent
    ],
    imports: [
        CommonModule,
        DialogModule,
        FormsModule,
        ReactiveFormsModule,
        SearchRoutingModule,
        TieredMenuModule,
        TableModule
    ]
})
export class SearchModule {
}
