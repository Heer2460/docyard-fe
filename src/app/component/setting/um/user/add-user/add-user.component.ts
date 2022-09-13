import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReferencesStatuses} from "../../../../../util/references.statuses";

@Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.less']
})
export class AddUserComponent implements OnInit {

    addUserForm: FormGroup = new FormGroup({});

    statuses = ReferencesStatuses.userStatuses;

    constructor(private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.buildForms();
    }

    buildForms() {
        this.addUserForm = this.fb.group({
            username: [null, [Validators.required, Validators.maxLength(35)]],
            name: [null, [Validators.required, Validators.maxLength(70)]],
            email: [null, [Validators.required, Validators.email, Validators.maxLength(50)]],
            phoneNumber: [null, [Validators.required, Validators.maxLength(32)]],
            mobileNumber: [null, [Validators.required, Validators.maxLength(32)]],
            password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(32)]],
            confirm_password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(32)]],
            group: [null, Validators.required],
            department: [null],
            address: [null, Validators.maxLength(256)],
            status: ['Active'],
        });
    }

}
