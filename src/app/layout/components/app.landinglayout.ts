import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterWidget } from '@/pages/components/landing/components/footerwidget';
import { TopbarWidget } from '@/pages/components/landing/components/topbar/topbarwidget';

@Component({
    selector: 'app-landing-layout',
    standalone: true,
    imports: [CommonModule, TopbarWidget, RouterModule, FooterWidget],
    template: ` <app-topbar-widget />
        <main>
            <router-outlet></router-outlet>
        </main>
        <app-footer-widget />`
})
export class LandingLayout {}
