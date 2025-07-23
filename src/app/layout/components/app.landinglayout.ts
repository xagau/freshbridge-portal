import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterWidget } from '@/pages/UI-component/landing/components/footerwidget';
import { TopbarWidget } from '@/pages/UI-component/landing/components/topbar/topbarwidget';

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
