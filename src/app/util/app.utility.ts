import {RoleActionConstants} from "./role.actions.constants";

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

    // handle form-control error messages
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

    // set roles & image-preview-actions
    setRoles(roles: any) {
        // console.log(roles);
        if (roles && roles.length > 0) {
            roles.forEach((menu: any) => {
                menu.children.forEach((subMenu: any) => {
                    switch (subMenu.route) {
                        // User Management
                        case RoleActionConstants.USER_ROUTE.url:
                            RoleActionConstants.USER_ROUTE.valid = true;
                            this.setUserActions(subMenu.moduleActionDTOList);
                            break;
                        case RoleActionConstants.GROUP_ROUTE.url:
                            RoleActionConstants.GROUP_ROUTE.valid = true;
                            this.setGroupActions(subMenu.moduleActionDTOList);
                            break;
                        case RoleActionConstants.ROLE_ROUTE.url:
                            RoleActionConstants.ROLE_ROUTE.valid = true;
                            this.setRoleActions(subMenu.moduleActionDTOList);
                            break;
                        // References
                        case RoleActionConstants.DEPARTMENT_ROUTE.url:
                            RoleActionConstants.DEPARTMENT_ROUTE.valid = true;
                            this.setDepartmentActions(subMenu.moduleActionDTOList);
                            break;

                    }
                });
            });
        }
    }

    private setUserActions(actions: any) {
        actions.forEach((action: any) => {
            switch (action.slug) {
                case RoleActionConstants.USER_ADD.key:
                    RoleActionConstants.USER_ADD.value = true;
                    RoleActionConstants.USER_ADD_ROUTE.valid = true;
                    break;
                case RoleActionConstants.USER_VIEW.key:
                    RoleActionConstants.USER_VIEW.value = true;
                    RoleActionConstants.USER_VIEW_ROUTE.valid = true;
                    break;
                case RoleActionConstants.USER_EDIT.key:
                    RoleActionConstants.USER_EDIT.value = true;
                    RoleActionConstants.USER_EDIT_ROUTE.valid = true;
                    break;
                case RoleActionConstants.USER_DEL.key:
                    RoleActionConstants.USER_DEL.value = true;
                    break;
                case RoleActionConstants.USER_UNLOCK.key:
                    RoleActionConstants.USER_UNLOCK.value = true;
                    break;
            }
        });
    }

    private setGroupActions(actions: any) {
        actions.forEach((action: any) => {
            switch (action.slug) {
                case RoleActionConstants.GROUP_ADD.key:
                    RoleActionConstants.GROUP_ADD.value = true;
                    RoleActionConstants.GROUP_ADD_ROUTE.valid = true;
                    break;
                case RoleActionConstants.GROUP_VIEW.key:
                    RoleActionConstants.GROUP_VIEW.value = true;
                    RoleActionConstants.GROUP_VIEW_ROUTE.valid = true;
                    break;
                case RoleActionConstants.GROUP_EDIT.key:
                    RoleActionConstants.GROUP_EDIT.value = true;
                    RoleActionConstants.GROUP_EDIT_ROUTE.valid = true;
                    break;
                case RoleActionConstants.GROUP_DEL.key:
                    RoleActionConstants.GROUP_DEL.value = true;
                    break;
            }
        });
    }

    private setRoleActions(actions: any) {
        actions.forEach((action: any) => {
            switch (action.slug) {
                case RoleActionConstants.ROLE_ADD.key:
                    RoleActionConstants.ROLE_ADD.value = true;
                    RoleActionConstants.ROLE_ADD_ROUTE.valid = true;
                    break;
                case RoleActionConstants.ROLE_VIEW.key:
                    RoleActionConstants.ROLE_VIEW.value = true;
                    RoleActionConstants.ROLE_VIEW_ROUTE.valid = true;
                    break;
                case RoleActionConstants.ROLE_EDIT.key:
                    RoleActionConstants.ROLE_EDIT.value = true;
                    RoleActionConstants.ROLE_EDIT_ROUTE.valid = true;
                    break;
                case RoleActionConstants.ROLE_DEL.key:
                    RoleActionConstants.ROLE_DEL.value = true;
                    break;
            }
        });
    }

    private setDepartmentActions(actions: any) {
        actions.forEach((action: any) => {
            switch (action.slug) {
                case RoleActionConstants.DEPT_ADD.key:
                    RoleActionConstants.DEPT_ADD.value = true;
                    RoleActionConstants.DEPARTMENT_ADD_ROUTE.valid = true;
                    break;
                case RoleActionConstants.DEPT_VIEW.key:
                    RoleActionConstants.DEPT_VIEW.value = true;
                    RoleActionConstants.DEPARTMENT_VIEW_ROUTE.valid = true;
                    break;
                case RoleActionConstants.DEPT_EDIT.key:
                    RoleActionConstants.DEPT_EDIT.value = true;
                    RoleActionConstants.DEPARTMENT_EDIT_ROUTE.valid = true;
                    break;
                case RoleActionConstants.DEPT_DEL.key:
                    RoleActionConstants.DEPT_DEL.value = true;
                    break;
            }
        });
    }
}
