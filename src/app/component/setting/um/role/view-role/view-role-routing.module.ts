import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ViewRoleComponent} from "./view-role.component";

const routes: Routes = [
  {
    path: '',
    component: ViewRoleComponent
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ViewRoleRoutingModule {
}
