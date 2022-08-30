import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
    selector: 'login-component',
    templateUrl: '../../../templates/auth/login/login.template.html',
    styleUrls: ['../../../styles/auth/login/login.component.less']
})
export class LoginComponent implements OnInit {

    constructor(private router: Router) {
    }

    ngOnInit(): void {
    }

    login() {
        this.router.navigate(['/dashboard']);
    }

}
