import {AbstractControl} from "@angular/forms";

export class CustomValidations {
    static passwordConfirming(control: AbstractControl) {
        // @ts-ignore
        if (control.get('password')?.value !== control.get('confirmPassword').value) {
            return { match: true }
        }
        return null;
    }
}
