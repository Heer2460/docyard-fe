export class AppBreadcrumbConstants {
    
    public static home: any = {
        title: 'Home',
        breadCrumb: [
            {
                label: 'Home',
                route: '/home',
                active: false,
            }
        ]
    };
    
    public static docLib: any = {
        title: 'Document Library',
        breadCrumb: [
            {
                label: 'Home',
                route: '/home',
                active: false,
            },
            {
                label: 'Document Library',
                route: '/doc-lib',
                active: true,
            }
        ]
    };
    
    public static setting: any = {
        title: 'Setting',
        breadCrumb: [
            {
                label: 'Home',
                route: '/home',
                active: false,
            },
            {
                label: 'Setting',
                route: '/setting',
                active: true,
            }
        ]
    };
    
    public static um: any = {
        title: 'User Management',
        breadCrumb: [
            {
                label: 'Home',
                route: '/home',
                active: false,
            },
            {
                label: 'User Management',
                route: '/setting/um',
                active: true,
            }
        ]
    };
    
    public static user: any = {
        title: 'User',
        breadCrumb: [
            {
                label: 'Home',
                route: '/home',
                active: false,
            },
            {
                label: 'User Management',
                route: '/setting/um',
                active: false,
            },
            {
                label: 'User',
                route: '/setting/um/user',
                active: true,
            }
        ]
    };
    
    public static addUser: any = {
        title: 'Add User',
        breadCrumb: [
            {
                label: 'Home',
                route: '/home',
                active: false,
            },
            {
                label: 'User Management',
                route: '/setting/um',
                active: false,
            },
            {
                label: 'User',
                route: '/setting/um/user',
                active: false,
            },
            {
                label: 'Add User',
                route: '/setting/um/user/add',
                active: true,
            }
        ]
    };
    
    public static ref: any = {
        title: 'Reference',
        breadCrumb: [
            {
                label: 'Home',
                route: '/home',
                active: false,
            },
            {
                label: 'Reference',
                route: '/setting/ref',
                active: true,
            }
        ]
    };
    
    public static dept: any = {
        title: 'Department',
        breadCrumb: [
            {
                label: 'Home',
                route: '/home',
                active: false,
            },
            {
                label: 'Reference',
                route: '/setting/ref',
                active: false,
            },
            {
                label: 'Department',
                route: '/setting/ref/dept',
                active: true,
            }
        ]
    };
    
    public static addDept: any = {
        title: 'Add Department',
        breadCrumb: [
            {
                label: 'Home',
                route: '/home',
                active: false,
            },
            {
                label: 'Reference',
                route: '/setting/ref',
                active: false,
            },
            {
                label: 'Department',
                route: '/setting/ref/dept',
                active: false,
            },
            {
                label: 'Add Department',
                route: '/setting/ref/dept/add',
                active: true,
            }
        ]
    };
    
    public static editDept: any = {
        title: 'Edit Department',
        breadCrumb: [
            {
                label: 'Home',
                route: '/home',
                active: false,
            },
            {
                label: 'Reference',
                route: '/setting/ref',
                active: false,
            },
            {
                label: 'Department',
                route: '/setting/ref/dept',
                active: false,
            },
            {
                label: 'Edit Department',
                route: '/setting/ref/dept/edit',
                active: true,
            }
        ]
    };
    
    public static theme: any = {
        title: 'Theme',
        breadCrumb: [
            {
                label: 'Home',
                route: '/home',
                active: false,
            },
            {
                label: 'Theme',
                route: '/setting/theme',
                active: true,
            }
        ]
    };
    
    
}
