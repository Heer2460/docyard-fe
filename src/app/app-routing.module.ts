import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from "./components/classes/layout/layout.component";

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                loadChildren: () => import('./components/classes/auth/auth.module').then(m => m.AuthModule)
            }
        ]
    },
    {
        path: 'dashboard',
        component: LayoutComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('./components/classes/dashboard/dashboard.module').then(m => m.DashboardModule)
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
