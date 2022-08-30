import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { UserProfileComponent } from './user-profile/user-profile.component';



@NgModule({
  declarations: [
    HeaderComponent,
    UserProfileComponent
  ],
  imports: [
    CommonModule
  ]
})
export class HeaderModule { }
