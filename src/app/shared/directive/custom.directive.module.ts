import {NgModule} from '@angular/core';
import {OnlyNumberDirective} from './only.number.directive';
import {FilterObjectPipe} from "../pipes/filter-object.pipe";
import {OnlyAlphanumericDirective} from "./only.alphanumeric.directive";

@NgModule({
    imports: [],
    exports: [
        OnlyNumberDirective,
        FilterObjectPipe,
        OnlyAlphanumericDirective
    ],
    declarations: [
        OnlyNumberDirective,
        FilterObjectPipe,
        OnlyAlphanumericDirective
    ],
    providers: []

})
export class CustomDirectiveModule {
}
