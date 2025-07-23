import { Component, ElementRef, HostListener, inject, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { LogoWidget } from '@/pages/UI-component/landing/components/logowidget';
import { AuthService } from '@/auth/auth.service'; 
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';

@Component({
    selector: 'app-topbar-widget',
    standalone: true,
    imports: [CommonModule, RouterModule, LogoWidget, AvatarModule, StyleClassModule, BadgeModule, OverlayBadgeModule],
    templateUrl: './topbarwidet.component.html',
    providers: [AuthService],
})
export class TopbarWidget {
    @Input() class: string = '';

    maxHeight: string = '0px';

    openMobileMenu: boolean = false;

    @ViewChild('navContainer') navContainer!: ElementRef;

    @ViewChild('menuContent') menuContent!: ElementRef;

    authService = inject(AuthService); // <-- Add this line

    isAuthenticated() {
        return this.authService.isAuthenticated;
    }
    
    isuser = false; // <-- Initialize the variable
    navs = [
        { name: 'features', label: 'Features', to: '/features' },
        { name: 'pricing', label: 'Pricing', to: '/pricing' },
        { name: 'contact', label: 'Contact', to: '/contact' }
    ];

    activeRouteName: string | null = null;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private el: ElementRef
    ) {}

    ngOnInit() {
        this.setActiveRoute();
        this.isuser = this.isAuthenticated();
        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => this.setActiveRoute());
    }

    setActiveRoute() {
        this.activeRouteName = this.activatedRoute.firstChild?.routeConfig?.path ?? null;
    }

    get maxHeightStyle(): string {
        return this.openMobileMenu ? `${this.getMenuContentHeight()}px` : this.maxHeight;
    }

    private getMenuContentHeight(): number {
        const menuContent = this.menuContent.nativeElement;
        return menuContent ? menuContent.scrollHeight : 0;
    }

    logout() {
        this.isuser = false;
        this.authService.logout();
    }

    @HostListener('document:click', ['$event'])
    handleClickOutside(event: Event) {
        const isOutsideClicked = !(
            this.navContainer.nativeElement.contains(event.target as Node) ||
            this.menuContent.nativeElement.contains(event.target as Node) ||
            this.navContainer.nativeElement.isSameNode(event.target as Node) ||
            this.menuContent.nativeElement.isSameNode(event.target as Node)
        );
        if (isOutsideClicked) {
            this.openMobileMenu = false;
        }
    }
}
