import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LazyImageWidget } from '@/pages/components/landing/components/lazyimagewidget';

@Component({
    selector: 'app-access',
    standalone: true,
    imports: [LazyImageWidget, RouterLink],
    template: `
        <section class="animate-fadein animate-duration-300 animate-ease-in landing-container mx-auto min-h-[75vh] lg:min-h-screen flex flex-col items-center justify-center">
            <app-lazy-image-widget className="w-[15rem]" [src]="'/images/landing/access-denied.png'" alt="404 Image" />
            <h1 class="title-h5 lg:title-h1 mt-8">Access Denied</h1>
            <p class="body-small lg:body-large mt-2 lg:mt-4">You don’t have the permissions to access this page</p>
            <a routerLink="/" class="body-button bg-violet-600 w-fit mt-8 hover:bg-violet-500 px-4">Go to Dashboard</a>
        </section>
    `
})
export class Access {}
