import {NgModule} from '@angular/core';
import {OnlyNumberDirective} from './only.number.directive';
import {FilterObjectPipe} from "../pipes/filter-object.pipe";
import {OnlyAlphanumericDirective} from "./only.alphanumeric.directive";
import {TruncatePipe} from "../pipes/truncate.pipe";

@NgModule({
    imports: [],
    exports: [
        OnlyNumberDirective,
        OnlyAlphanumericDirective,
        FilterObjectPipe,
        TruncatePipe
    ],
    declarations: [
        OnlyNumberDirective,
        OnlyAlphanumericDirective,
        FilterObjectPipe,
        TruncatePipe
    ],
    providers: []

})
export class CustomDirectiveModule {
}
