import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
    selector: '[onlyAlphaNumeric]'
})
export class OnlyAlphanumericDirective {

    constructor(private _el: ElementRef) {
    }

    @HostListener('keydown', ['$event']) onKeyDown(event: any) {
        let e = <KeyboardEvent>event;
        let keyCodes = [46, 8, 9, 27, 13, 110, 190];
        if (keyCodes.indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
            // Allow: Ctrl+C
            (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
            // Allow: Ctrl+V
            (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
            // Allow: Ctrl+X
            (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105) &&
            (e.keyCode < 65 || e.keyCode > 90) && e.keyCode != 189 && e.keyCode != 187 && e.keyCode != 106 && e.keyCode != 49
            && e.keyCode != 52 && e.keyCode != 56 && e.keyCode != 57 && e.keyCode != 48 && e.keyCode != 188 && e.keyCode != 222
        ) {
            console.log(e.keyCode)
            e.preventDefault();
        }
    }


}
