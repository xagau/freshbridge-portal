import { Component, computed, inject } from '@angular/core';
import { LazyImageWidget } from '@/pages/components/landing/components/lazyimagewidget';
import { LayoutService } from '@/layout/service/layout.service';
import { RouterLink } from '@angular/router';
import { AppConfigurator } from '@/layout/components/app.configurator';

@Component({
    selector: 'app-oops',
    standalone: true,
    imports: [LazyImageWidget, RouterLink, AppConfigurator],
    template: ` <section class="animate-fadein animate-duration-300 animate-ease-in landing-container mx-auto min-h-[75vh] lg:min-h-screen flex flex-col items-center justify-center">
            <app-lazy-image-widget className="w-64 lg:w-96" [src]="'/images/landing/' + (isDarkTheme() ? 'oops-dark.png' : 'oops.png')" alt="404 Image" />
            <h1 class="title-h5 lg:title-h1 mt-8">Oops!</h1>
            <p class="body-small lg:body-large mt-2 lg:mt-4">There is nothing here</p>
            <a routerLink="/" class="body-button bg-orange-600 w-fit mt-8 hover:bg-orange-500 px-4">Go to Dashboard</a>
        </section>
        <app-configurator simple />`
})
export class Oops {
    layoutService = inject(LayoutService);
    isDarkTheme = computed(() => this.layoutService.isDarkTheme());
}
