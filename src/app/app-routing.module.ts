import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from "./component/layout/layout.component";

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                loadChildren: () => import('./component/auth/auth.module').then(m => m.AuthModule)
            }
        ]
    },
    {
        path: 'home',
        children: [
            {
                path: '',
                loadChildren: () => import('./component/home/home.module').then(m => m.HomeModule)
            }
        ]
    },
    {
        path: 'doc-lib',
        children: [
            {
                path: '',
                loadChildren: () => import('./component/doc-lib/doc-lib.module').then(m => m.DocLibModule)
            }
        ]
    },
    {
        path: 'setting',
        children: [
            {
                path: '',
                loadChildren: () => import('./component/setting/setting.module').then(m => m.SettingModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
