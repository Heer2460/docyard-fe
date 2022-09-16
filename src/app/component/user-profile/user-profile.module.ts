import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { UserProfileComponent } from './user-profile.component';
import {LayoutModule} from "../layout/layout.module";


@NgModule({
  declarations: [
    UserProfileComponent
  ],
    imports: [
        CommonModule,
        UserProfileRoutingModule,
        LayoutModule
    ]
})
export class UserProfileModule { }
