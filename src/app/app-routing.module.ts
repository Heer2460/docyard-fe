import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from "./component/classes/layout/layout.component";

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                loadChildren: () => import('./component/classes/auth/auth.module').then(m => m.AuthModule)
            }
        ]
    },
    {
        path: 'home',
        component: LayoutComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('./component/classes/home/home.module').then(m => m.HomeModule)
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
