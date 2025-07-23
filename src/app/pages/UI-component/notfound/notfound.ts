import { Component, computed, inject } from '@angular/core';
import { LazyImageWidget } from '@/pages/UI-component/landing/components/lazyimagewidget';
import { LayoutService } from '@/layout/service/layout.service';
import { RouterModule } from '@angular/router';
import { AppConfigurator } from '@/layout/components/app.configurator';

@Component({
    selector: 'app-notfound',
    standalone: true,
    imports: [LazyImageWidget, RouterModule, AppConfigurator],
    template: ` <section class="animate-fadein animate-duration-300 animate-ease-in landing-container mx-auto min-h-[75vh] lg:min-h-screen flex flex-col items-center justify-center">
            <app-lazy-image-widget className="w-64 lg:w-96" [src]="'/images/landing/' + (isDarkTheme() ? '404-dark.png' : '404.png')" alt="404 Image" />
            <h1 class="title-h5 lg:title-h1 mt-8">Error</h1>
            <p class="body-small lg:body-large mt-2 lg:mt-4">Something gone wrong!</p>
            <a routerLink="/" class="body-button bg-red-600 w-fit mt-8 hover:bg-red-500 px-4">Go to Dashboard</a>
        </section>
        <app-configurator simple />`
})
export class Notfound {
    layoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());
}
