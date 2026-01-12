import { Component, computed, inject } from '@angular/core';
import { LayoutService } from '@/layout/service/layout.service';
import { HorizontalGridWidget } from '@/pages/components/landing/components/horizontalgridwidget';
import { LazyImageWidget } from '@/pages/components/landing/components/lazyimagewidget';
import { RouterLink } from '@angular/router';
import { CustomersLogoWidget } from '@/pages/components/landing/components/customerslogowidget';

@Component({
    selector: 'app-features-hero-widget',
    standalone: true,
    imports: [HorizontalGridWidget, LazyImageWidget, RouterLink, CustomersLogoWidget],
    template: `
        <section class="animate-fadein animate-duration-300 animate-ease-in relative lg:pb-14 lg:pt-52 pt-36 pb-10">
            <app-horizontal-grid-widget class="top-[26rem] lg:top-[30rem]" />
            <div class="relative z-10 mx-auto landing-container overflow-hidden">
                <div class="flex flex-col items-center">
                    <h1 class="title-h4 lg:title-h1">
                        Our Customer <br />
                        <span class="text-primary-600">Centric Approach</span>
                    </h1>
                    <p class="body-small lg:body-medium mt-4 lg:mt-6 max-w-xs md:max-w-xl">Our approach revolves around prioritizing and tailoring our services to meet the needs and expectations of our customers.</p>
                    <a routerLink="/" class="body-button mt-6 lg:mt-8">Get Started</a>
                </div>
                <div class="relative mb-16 md:mb-20 lg:mb-28 mt-14 xl:-mt-1 md:h-[27rem] w-fit mx-auto md:w-full">
                    <app-lazy-image-widget
                        className="md:block hidden w-[26rem] rounded-2xl h-auto absolute top-0 md:left-[15%] lg:left-0 shadow-[0px_5px_20px_0px_rgba(0,0,0,0.03),0px_117.091px_32.409px_0px_rgba(0,0,0,0.00),0px_75.273px_30.318px_0px_rgba(0,_0,_0,_0.01)] transition-all"
                        [src]="'/images/landing/boxes/' + (isDarkTheme() ? 'new-customer-dark.png' : 'new-customer.png')"
                        alt="Features Hero Box Image"
                        style="display: contents;"
                    />
                    <app-lazy-image-widget
                        className="w-[25rem] md:w-[26rem] rounded-2xl h-auto md:absolute bottom-0 left-1/2 md:left-[65%] lg:left-1/2 md:-translate-x-1/2 shadow-[0px_10px_40px_0px_rgba(0,0,0,0.06),0px_117.091px_32.409px_0px_rgba(0,0,0,0.00),0px_75.273px_30.318px_0px_rgba(0,0,0,0.01)] transition-all"
                        [src]="'/images/landing/boxes/' + (isDarkTheme() ? 'avg-monthly-order-dark.png' : 'avg-monthly-order.png')"
                        alt="Features Hero Box Image"
                        style="display: contents;"
                    />
                    <app-lazy-image-widget
                        className="lg:block hidden w-[26rem] rounded-2xl h-auto absolute top-11 right-0 shadow-[0px_5px_20px_0px_rgba(0,0,0,0.03),0px_117.091px_32.409px_0px_rgba(0,0,0,0.00),0px_75.273px_30.318px_0px_rgba(0,0,0,0.01)] transition-all"
                        [src]="'/images/landing/boxes/' + (isDarkTheme() ? 'sales-rate-dark.png' : 'sales-rate.png')"
                        alt="Features Hero Box Image"
                        style="display: contents;"
                    />
                </div>
                <app-customers-logo-widget />
            </div>
        </section>
    `
})
export class FeaturesHeroWidget {
    layoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());
}
