import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppShipmentView } from '@/layout/components/app.shipmentView';
import { CardModule } from 'primeng/card';
import { AuthService } from '@/auth/auth.service';

@Component({
    selector: 'banner-widget',
    standalone: true,
    imports: [CommonModule, CardModule],
    templateUrl: './bannerwidget.component.html',
    host: {
        class: 'flex w-full flex-wrap gap-7'
    },
    providers: [AppShipmentView], 
})
export class BannerWidget implements OnInit {

    isTestUser = signal(false);

    constructor(private authService: AuthService) { }

    ngOnInit() {
        const email = this.authService.currentUserValue?.email;
        console.log("email", email);
        this.isTestUser.set(true);

        // if (email == 'testuser@gmail.com' || email == 'kevin.sambirsky@gmail.com') {
        //     this.isTestUser.set(true);
        //     console.log("isTestUser", this.isTestUser);

        // } else {
        //     this.isTestUser.set(false);
        // }
    }

}