import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { ToastrModule } from "ngx-toastr";
import {
    NgxUiLoaderConfig, NgxUiLoaderHttpModule,
    NgxUiLoaderModule,
    NgxUiLoaderRouterModule,
    PB_DIRECTION
} from "ngx-ui-loader";
import { ConfirmationService } from "primeng/api";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppUtility } from "./util/app.utility";
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
    fgsSize: 100,
    fgsColor: '#67A352',
    fgsType: "ball-scale-multiple",
    overlayColor: 'rgba(80, 127, 148, 30%)',
    pbColor: '#ee0f0f',
    pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
    pbThickness: 5, // progress bar thickness
};

@NgModule({
    declarations: [
        AppComponent,
        PageNotFoundComponent,
    ],
    imports: [
        RouterModule,
        BrowserModule,
        CommonModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            timeOut: 5000,
            closeButton: true
        }),
        NgxUiLoaderModule,
        NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
        NgxUiLoaderRouterModule,
        NgxUiLoaderHttpModule.forRoot({ showForeground: true })
    ],
    providers: [
        AppUtility,
        ConfirmationService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
