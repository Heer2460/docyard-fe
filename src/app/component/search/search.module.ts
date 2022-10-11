import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SearchRoutingModule} from './search-routing.module';
import {SearchComponent} from './search.component';
import {TieredMenuModule} from "primeng/tieredmenu";
import {TableModule} from "primeng/table";


@NgModule({
    declarations: [
        SearchComponent
    ],
  imports: [
    CommonModule,
    SearchRoutingModule,
    TieredMenuModule,
    TableModule
  ]
})
export class SearchModule {
}
