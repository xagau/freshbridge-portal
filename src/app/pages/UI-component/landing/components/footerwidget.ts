import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LogoWidget } from '@/pages/UI-component/landing/components/logowidget';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-footer-widget',
    standalone: true,
    imports: [CommonModule, RouterModule, LogoWidget],
    template: `
        <section [ngClass]="class" class="relative border-t border-surface-200 dark:border-surface-800">
            <div class="absolute bottom-0 w-full max-h-52 min-h-14">
                <svg class="w-full h-full" width="1440" height="167" viewBox="0 0 1440 167" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path stroke="url(#paint0_linear_2001_3287)" stroke-opacity="0.6" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <defs>
                        <linearGradient id="paint0_linear_2001_3287" x1="720" y1="167" x2="720" y2="43.4727" gradientUnits="userSpaceOnUse">
                            <stop class="[stop-color:var(--p-surface-200)] dark:[stop-color:var(--p-surface-800)]" />
                            <stop offset="1" class="[stop-color:var(--p-surface-0)] dark:[stop-color:var(--p-surface-950)]" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <div class="relative z-20 landing-container mx-auto md:pt-20 md:pb-14 py-8">
                <footer class="flex items-center justify-between md:flex-row flex-col gap-8 md:gap-0">
                    <div class="flex items-center md:flex-row flex-col gap-8 md:gap-0">
                        <a routerLink="/">
                            <logo-widget></logo-widget>
                        </a>
                        <div class="h-4 w-[1px] bg-surface-200 dark:bg-surface-800 mx-4 md:block hidden"></div>
                        <ul class="flex items-center gap-4">
                            <li *ngFor="let nav of navs">
                                <a [routerLink]="nav.to" class="body-small hover:underline">
                                    {{ nav.label }}
                                </a>
                            </li>
                        </ul>
                    </div>
                    <ul class="flex items-center gap-2">
                        <li *ngFor="let data of socials">
                            <a
                                [href]="data.to"
                                target="_blank"
                                class="px-4 py-2 rounded-full border border-surface-200 dark:border-surface-800 text-surface-950 dark:text-surface-0 flex items-center justify-center hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
                            >
                                <i [ngClass]="data.icon" class="text-md leading-none"></i>
                            </a>
                        </li>
                    </ul>
                </footer>
                <div class="w-full h-[1px] bg-surface-200 dark:bg-surface-800 my-7 md:my-4"></div>
                <div class="text-center body-small">© {{ currentYear }} FreshBridge</div>
            </div>
        </section>
    `
})
export class FooterWidget {
    @Input() class: string | undefined;

    currentYear: number = new Date().getFullYear();

    navs = [
        { to: '/landing/', label: 'Product' },
        { to: '/landing/contact', label: 'Contact' },
        { to: '/auth/login', label: 'Login' },
        { to: '/auth/register', label: 'Register' }
    ];

    socials = [
        { to: 'https://x.com/bridge_fre66357', icon: 'pi pi-twitter' },
        { to: 'https://www.youtube.com/@1FreshBridge', icon: 'pi pi-youtube' },
        { to: 'https://www.linkedin.com/company/FreshBridge    ', icon: 'pi pi-linkedin' },
        { to: 'https://www.instagram.com/1FreshBridge', icon: 'pi pi-instagram' }
    ];
}
