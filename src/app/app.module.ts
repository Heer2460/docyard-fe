import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {RouterModule} from "@angular/router";
import {ToastrModule} from "ngx-toastr";
import {
    NgxUiLoaderConfig,
    NgxUiLoaderHttpModule,
    NgxUiLoaderModule,
    NgxUiLoaderRouterModule,
    PB_DIRECTION
} from "ngx-ui-loader";
import {ConfirmationService} from "primeng/api";
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AppUtility} from "./util/app.utility";
import {PageNotFoundComponent} from './component/page-not-found/page-not-found.component';
import {environment} from "../environments/environment";
import {initializeApp} from "firebase/app";
import {ResetPasswordComponent} from "./component/reset-password/reset-password.component";

initializeApp(environment.firebase);

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
        ResetPasswordComponent
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
        NgxUiLoaderHttpModule.forRoot({
            showForeground: true, exclude: [
                `${environment.http_protocol + environment.http_separator + environment.api_end_point_url + ':' + environment.api_end_point_port}/dl/dl-document/upload`,
            ]
        })
    ],
    providers: [
        AppUtility,
        ConfirmationService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
