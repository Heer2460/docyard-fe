import {NgModule} from '@angular/core';
import {OnlyNumberDirective} from './only.number.directive';
import {FilterObjectPipe} from "../pipes/filter-object.pipe";

@NgModule({
    imports: [],
    exports: [
        OnlyNumberDirective,
        FilterObjectPipe,
    ],
    declarations: [
        OnlyNumberDirective,
        FilterObjectPipe
    ],
    providers: []

})
export class CustomDirectiveModule {
}
