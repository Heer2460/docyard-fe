import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BreadcrumbComponent} from "./breadcrumb.component";
import {RouterLinkWithHref} from "@angular/router";

@NgModule({
    declarations: [
        BreadcrumbComponent
    ],
    exports: [
        BreadcrumbComponent
    ],
    imports: [
        CommonModule,
        RouterLinkWithHref
    ]
})
export class BreadcrumbModule { }
