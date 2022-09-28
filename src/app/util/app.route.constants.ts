import {RoutesDTO} from "../model/routes.dto";

export class AppRouteConstants {
    public static mainRoutes: RoutesDTO[] = [
        {
            label: 'Home',
            route: '/home',
            icon: 'icon-home',
            expended: false,
            active: false,
            
        },
        {
            label: 'Document Library',
            route: '/doc-lib',
            icon: 'icon-cloud',
            expended: false,
            active: false,
            
        },
        {
            label: 'Shared by Me',
            route: '/shared-by-me',
            icon: 'icon-shared-by-me',
            expended: false,
            active: false,
            
        },
        {
            label: 'Shared with Me',
            route: '/shared-with-me',
            icon: 'icon-shared-with-me',
            expended: false,
            active: false,
            
        },
        {
            label: 'Favourite',
            route: '/favourite',
            icon: 'icon-star',
            expended: false,
            active: false,
            
        },
        {
            label: 'Trash',
            route: '/trash',
            icon: 'icon-trash',
            expended: false,
            active: false,
            
        },
        {
            label: 'Setting',
            route: '/setting',
            icon: 'icon-cog',
            expended: false,
            active: false,
            children: [
                {
                    label: 'User Management',
                    route: '/setting/um',
                    icon: 'icon-um',
                    expended: false,
                    active: false,
                    children: [
                        {
                            label: 'User',
                            route: '/setting/um/user',
                            icon: 'icon-users',
                            expended: false,
                            active: false
                        },
                        {
                            label: 'Role',
                            route: '/setting/um/role',
                            icon: 'icon-role',
                            expended: false,
                            active: false
                        },
                        {
                            label: 'Group',
                            route: '/setting/um/group',
                            icon: 'icon-group',
                            expended: false,
                            active: false
                        },
                    ]
                },
                {
                    label: 'Reference',
                    route: '/setting/ref',
                    icon: 'icon-link',
                    expended: false,
                    active: false,
                    children: [
                        {
                            label: 'Department',
                            route: '/setting/ref/department',
                            icon: 'icon-building',
                            expended: false,
                            active: false
                        }
                    ]
                },
                /*{
                    label: 'Theme',
                    route: '/setting/theme',
                    icon: 'icon-link',
                    expended: false,
                    active: false,
                }*/
            ]

        },
    ];
    public static settingRoutes: RoutesDTO[] = [
        {
            label: 'Home',
            route: '/home',
            icon: 'icon-home',
            expended: false,
            active: false,
            
        },
        {
            label: 'User Management',
            route: '/setting/um',
            icon: 'icon-um',
            expended: false,
            active: false,
            children: [
                {
                    label: 'User',
                    route: '/setting/um/user',
                    icon: 'icon-users',
                    expended: false,
                    active: false
                },
                {
                    label: 'Role',
                    route: '/setting/um/role',
                    icon: 'icon-role',
                    expended: false,
                    active: false
                },
                {
                    label: 'Group',
                    route: '/setting/um/group',
                    icon: 'icon-group',
                    expended: false,
                    active: false
                },
            ]
        },
        {
            label: 'Reference',
            route: '/setting/ref',
            icon: 'icon-link',
            expended: false,
            active: false,
            children: [
                {
                    label: 'Department',
                    route: '/setting/ref/department',
                    icon: 'icon-building',
                    expended: false,
                    active: false
                }
            ]
        },
        /*{
            label: 'Theme',
            route: '/setting/theme',
            icon: 'icon-link',
            expended: false,
            active: false,
        }*/
    ];
}


