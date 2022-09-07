import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingComponent} from "./setting.component";

const routes: Routes = [
    {
        path: '',
        component: SettingComponent
    },
    {
        path: 'user',
        children: [
            {
                path: '',
                loadChildren: () => import('./user/user.module').then(m => m.UserModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SettingRoutingModule {
}
