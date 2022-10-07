import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ListingDisplayComponent} from "./listing-display.component";
import {RouterLinkWithHref} from "@angular/router";

@NgModule({
    declarations: [
        ListingDisplayComponent
    ],
    exports: [
        ListingDisplayComponent
    ],
    imports: [
        CommonModule,
        RouterLinkWithHref
    ]
})
export class ListingDisplayModule { }
