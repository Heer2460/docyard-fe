import {RoleActionsConstants} from "./role.actions.constants";

export class AppUtility {


    // handle form-control errors
    public getFormError(userForm: any, control: any, name: any, rule: any, type: string = '') {
        let error;
        if (type == 'group' || type == 'password') {
            switch (rule) {
                case 'required':
                    error = userForm.controls[control].get(name)?.errors?.required &&
                        userForm.controls[control].get(name)?.touched;
                    break;
                case 'maxlength':
                    error = userForm.controls[control].get(name)?.errors?.maxlength &&
                        userForm.controls[control].get(name)?.touched;
                    break;
                case 'minlength':
                    error = userForm.controls[control].get(name)?.errors?.minlength &&
                        userForm.controls[control].get(name)?.touched;
                    break;
                case 'pattern':
                    error = userForm.controls[control].get(name)?.errors?.pattern &&
                        userForm.controls[control].get(name)?.touched;
                    break;
                case 'onlySpace':
                    error = userForm.controls[control].get(name)?.errors?.onlySpace &&
                        userForm.controls[control].get(name)?.touched;
                    break;
                case 'email':
                    error = userForm.controls[control].get(name)?.errors?.email &&
                        userForm.controls[control].get(name)?.touched;
                    break;
                case 'max':
                    error = userForm.controls[control].get(name)?.errors?.max &&
                        userForm.controls[control].get(name)?.touched;
                    break;
                case 'min':
                    error = userForm.controls[control].get(name)?.errors?.min &&
                        userForm.controls[control].get(name)?.touched;
                    break;
                case 'match':
                    error = userForm.controls[control].errors?.match &&
                        userForm.controls[control]?.touched;
                    break;
                case 'invalid':
                    error = userForm.controls[control].errors?.invalid &&
                        userForm.controls[control]?.touched;
                    break;
            }
        } else {
            switch (rule) {
                case 'required':
                    error = userForm.get(name)?.errors?.required &&
                        userForm.get(name)?.touched;
                    break;
                case 'maxlength':
                    error = userForm.get(name)?.errors?.maxlength &&
                        userForm.get(name)?.touched;
                    break;
                case 'minlength':
                    error = userForm.get(name)?.errors?.minLength &&
                        userForm.get(name)?.touched;
                    break;
                case 'pattern':
                    error = userForm.get(name)?.errors?.pattern &&
                        userForm.get(name)?.touched;
                    break;
                case 'onlySpace':
                    error = userForm.get(name)?.errors?.onlySpace &&
                        userForm.get(name)?.touched;
                    break;
                case 'email':
                    error = userForm.get(name)?.errors?.email &&
                        userForm.get(name)?.touched;
                    break;
                case 'min':
                    error = userForm.get(name)?.errors?.min &&
                        userForm.get(name)?.touched;
                    break;
                case 'max':
                    error = userForm.get(name)?.errors?.max &&
                        userForm.get(name)?.touched;
                    break;
                case 'invalid':
                    error = userForm.get(name)?.errors?.invalid &&
                        userForm.get(name)?.touched;
                    break;
            }
        }
        return error;
    }

    public makeErrorMessage(...args: any[]) {
        let fieldLabel: string, rule: string, maxlength: number = 0, minlength: number = 0, charsType: string = '',
            errorMessage: string = '';

        fieldLabel = args[0];
        rule = args[1];
        maxlength = typeof args[2] === 'number' ? args[2] : 0;
        minlength = typeof args[2] === 'number' ? args[2] : 0;
        charsType = typeof args[2] === 'string' ? args[2] : '';
        errorMessage = args[3];

        switch (rule) {
            case 'required':
                errorMessage = fieldLabel + ' ' + 'is required.';
                break;
            case 'pattern':
                errorMessage = fieldLabel + ' ' + 'should only be' + ' ' + charsType + '.';
                break;
            case 'onlySpace':
                errorMessage = fieldLabel + ' ' + 'is invalid.';
                break;
            case 'maxlength':
                errorMessage = fieldLabel + ' ' + 'should be less than or equal to' + ' ' + maxlength + ' ' + 'characters' + '.';
                break;
            case 'minlength':
                errorMessage = fieldLabel + ' ' + 'should be greater than or equal to' + ' ' + minlength + ' ' + 'characters' + '.';
                break;
            case 'invalid':
                errorMessage = fieldLabel + ' ' + 'is invalid.';
                break;
        }
        return errorMessage;
    }
}
