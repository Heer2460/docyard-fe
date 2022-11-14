import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {getMessaging, onMessage} from "firebase/messaging";

@Component({
    selector: 'notification-component',
    templateUrl: './notification.template.html',
    styleUrls: ['./notification.component.less']
})
export class NotificationComponent implements OnInit {

    notifications: MenuItem[] = [
        {
            label: 'Push notification integrated, need to send from FCM.',
            icon: 'icon-bell',
            command: () => {
            }
        }
    ];

    constructor() {
    }

    ngOnInit(): void {
        this.listen();
    }

    listen() {
        const messaging = getMessaging();
        onMessage(messaging, (payload) => {
            this.notifications.push({
                label: payload?.notification?.body,
                icon: 'icon-bell',
                command: () => {
                }
            })
        });
    }

}
