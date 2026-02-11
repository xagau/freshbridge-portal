import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppShipmentView } from '@/layout/components/app.shipmentView';
import { CardModule } from 'primeng/card';
import { AuthService } from '@/auth/auth.service';
import { environment } from '../../../../environments/environment';

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
    bannerUrl = signal('');
    avatarUrl = signal('');
    environment = environment;
    bio = signal('');
    fullName = signal('');


    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.bannerUrl.set(environment.apiUrl + 'auth/banner/' + this.authService.currentUserValue?.bannerUrl);
        this.avatarUrl.set(this.authService.currentUserValue?.avatarUrl ? environment.apiUrl + 'auth/avatar/' + this.authService.currentUserValue?.avatarUrl : '');
        this.bio.set(this.authService.currentUserValue?.bio || '');
        this.fullName.set(this.authService.currentUserValue?.fullName || '');
    }
    setDefaultImage(event: Event) {
        const img = event.target as HTMLImageElement;
        // Set your default image path here
        img.src = 'images/logo/banner.png';

        // Optional: Add a CSS class to style broken images differently
        img.classList.add('default-image');
    }

    setDefaultAvatar(event: Event) {
        const img = event.target as HTMLImageElement;
        if(this.authService.currentUserValue?.role === 'MERCHANT') {
            img.src = 'images/avatar/merchant.png';
        } else {
            img.src = 'images/avatar/buyer.png';
        }
        img.classList.add('default-image');
    }
}