import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingComponent} from "./setting.component";

const routes: Routes = [
    {
        path: '',
        component: SettingComponent
    },
    {
        path: 'um',
        children: [
            {
                path: '',
                loadChildren: () => import('./um/um.module').then(m => m.UmModule)
            }
        ]
    },
    {
        path: 'ref',
        children: [
            {
                path: '',
                loadChildren: () => import('./ref/ref.module').then(m => m.RefModule)
            }
        ]
    },
    /*{
        path: 'theme',
        children: [
            {
                path: '',
                loadChildren: () => import('./theme/theme.module').then(m => m.ThemeModule)
            }
        ]
    }*/
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SettingRoutingModule {
}
