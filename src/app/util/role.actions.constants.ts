export class RoleActionConstants {

    // Application Routes

    // Main Home Route
    // public static HOME_ROUTE = {url: '/home', valid: true};

    // User Management Routes
    public static USER_MAIN_ROUTE = {url: '/setting/um', valid: true};

    // User Routes
    public static USER_ROUTE = {url: '/setting/um/user', valid: false};
    public static USER_ADD_ROUTE = {url: '/setting/um/user/add', valid: false};
    public static USER_VIEW_ROUTE = {url: '/setting/um/user/view', valid: false};
    public static USER_EDIT_ROUTE = {url: '/setting/um/user/edit', valid: false};

    // Group Routes
    public static GROUP_ROUTE = {url: '/setting/um/group', valid: false};
    public static GROUP_ADD_ROUTE = {url: '/setting/um/group/add', valid: false};
    public static GROUP_VIEW_ROUTE = {url: '/setting/um/group/view', valid: false};
    public static GROUP_EDIT_ROUTE = {url: '/setting/um/group/edit', valid: false};

    // Roles Routes
    public static ROLE_ROUTE = {url: '/setting/um/role', valid: false};
    public static ROLE_ADD_ROUTE = {url: '/setting/um/role/add', valid: false};
    public static ROLE_VIEW_ROUTE = {url: '/setting/um/role/view', valid: false};
    public static ROLE_EDIT_ROUTE = {url: '/setting/um/role/edit', valid: false};


    // Reference Routes
    public static REFERENCE_MAIN_ROUTE = {url: '/setting/ref', valid: true};

    // Department Routes
    public static DEPARTMENT_ROUTE = {url: '/setting/ref/department', valid: false};
    public static DEPARTMENT_ADD_ROUTE = {url: '/setting/ref/department/add', valid: false};
    public static DEPARTMENT_VIEW_ROUTE = {url: '/setting/ref/department/view', valid: false};
    public static DEPARTMENT_EDIT_ROUTE = {url: '/setting/ref/department/edit', valid: false};



    // Application Actions

    // User Management Actions

    // User Actions
    public static USER_ADD = {
        key: 'USER_ADD',
        value: false
    };
    public static USER_VIEW = {
        key: 'USER_VIEW',
        value: false
    };
    public static USER_EDIT = {
        key: 'USER_EDIT',
        value: false
    };
    public static USER_DEL = {
        key: 'USER_DEL',
        value: false
    };
    public static USER_UNLOCK = {
        key: 'USER_UNLOCK',
        value: false
    };
    
    // Group Actions
    public static GROUP_ADD = {
        key: 'GROUP_ADD',
        value: false
    };
    public static GROUP_VIEW = {
        key: 'GROUP_VIEW',
        value: false
    };
    public static GROUP_EDIT = {
        key: 'GROUP_EDIT',
        value: false
    };
    public static GROUP_DEL = {
        key: 'GROUP_DEL',
        value: false
    };

    // Role Actions
    public static ROLE_ADD = {
        key: 'ROLE_ADD',
        value: false
    };
    public static ROLE_VIEW = {
        key: 'ROLE_VIEW',
        value: false
    };
    public static ROLE_EDIT = {
        key: 'ROLE_EDIT',
        value: false
    };
    public static ROLE_DEL = {
        key: 'ROLE_DEL',
        value: false
    };


    // Reference Actions

    // Department Actions
    public static DEPT_ADD = {
        key: 'DEPT_ADD',
        value: false
    };
    public static DEPT_VIEW = {
        key: 'DEPT_VIEW',
        value: false
    };
    public static DEPT_EDIT = {
        key: 'DEPT_EDIT',
        value: false
    };
    public static DEPT_DEL = {
        key: 'DEPT_DEL',
        value: false
    };


    // Reset all permissions & actions
    public static resetPermission() {
        // routes
        RoleActionConstants.USER_ROUTE.valid = false;
        RoleActionConstants.USER_ADD_ROUTE.valid = false;
        RoleActionConstants.USER_VIEW_ROUTE.valid = false;
        RoleActionConstants.USER_EDIT_ROUTE.valid = false;

        RoleActionConstants.GROUP_ROUTE.valid = false;
        RoleActionConstants.GROUP_ADD_ROUTE.valid = false;
        RoleActionConstants.GROUP_VIEW_ROUTE.valid = false;
        RoleActionConstants.GROUP_EDIT_ROUTE.valid = false;

        RoleActionConstants.ROLE_ROUTE.valid = false;
        RoleActionConstants.ROLE_ADD_ROUTE.valid = false;
        RoleActionConstants.ROLE_VIEW_ROUTE.valid = false;
        RoleActionConstants.ROLE_EDIT_ROUTE.valid = false;


        RoleActionConstants.DEPARTMENT_ROUTE.valid = false;
        RoleActionConstants.DEPARTMENT_ADD_ROUTE.valid = false;
        RoleActionConstants.DEPARTMENT_VIEW_ROUTE.valid = false;
        RoleActionConstants.DEPARTMENT_EDIT_ROUTE.valid = false;


        //actions
        RoleActionConstants.USER_ADD.value = false;
        RoleActionConstants.USER_VIEW.value = false;
        RoleActionConstants.USER_EDIT.value = false;
        RoleActionConstants.USER_DEL.value = false;
        RoleActionConstants.USER_UNLOCK.value = false;

        RoleActionConstants.GROUP_ADD.value = false;
        RoleActionConstants.GROUP_VIEW.value = false;
        RoleActionConstants.GROUP_EDIT.value = false;
        RoleActionConstants.GROUP_DEL.value = false;

        RoleActionConstants.ROLE_ADD.value = false;
        RoleActionConstants.ROLE_VIEW.value = false;
        RoleActionConstants.ROLE_EDIT.value = false;
        RoleActionConstants.ROLE_DEL.value = false;

        RoleActionConstants.DEPT_ADD.value = false;
        RoleActionConstants.DEPT_VIEW.value = false;
        RoleActionConstants.DEPT_EDIT.value = false;
        RoleActionConstants.DEPT_DEL.value = false;
    }
}
