import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { LazyImageWidget } from '@/pages/components/landing/components/lazyimagewidget';
import { LayoutService } from '@/layout/service/layout.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-section-one-widget',
    standalone: true,
    imports: [CommonModule, LazyImageWidget, RouterLink],
    template: `
        <section class="max-w-[77rem] landing-container mx-auto relative py-12 lg:py-24">
            <div class="flex lg:flex-row flex-col items-center gap-14 lg:gap-4 xl:gap-9">
                <div class="relative lg:flex-1 h-[26.2rem] lg:h-[42rem] w-full max-w-[25rem] lg:max-w-[42rem]">
                    <app-lazy-image-widget
                        className="lg:block hidden rounded-xl absolute h-full w-auto top-0 left-0"
                        [src]="'/images/landing/' + (isDarkTheme() ? 'landing-section-pattern-dark.png' : 'landing-section-pattern.png')"
                        alt="Features Section One Box Image"
                        style="display: contents;"
                    />
                    <app-lazy-image-widget
                        className="rounded-xl absolute rotate-[-22.6deg] lg:rotate-0 left-[3.28rem] lg:left-10 top-[2.5rem] lg:top-56 w-[15.8rem] lg:w-[16.7rem] shadow-[0px_200.426px_55.957px_0px_rgba(0,0,0,0.00),0px_128.191px_50.87px_0px_rgba(0,0,0,0.00),0px_72.235px_42.73px_0px_rgba(0,0,0,0.01),0px_31.539px_31.539px_0px_rgba(0,0,0,0.02),0px_8.139px_17.296px_0px_rgba(0,0,0,0.02)]"
                        src="/images/landing/boxes/farmer-happy.png"
                        alt="Features Section One Box Image"
                        style="display: contents;"
                    />
                    <app-lazy-image-widget
                        className="rounded-xl absolute right-0 lg:right-auto lg:left-[21rem] bottom-0 lg:bottom-auto lg:top-72 w-[17.3rem] lg:w-[14.6rem] shadow-[0px_200.426px_55.957px_0px_rgba(0,0,0,0.00),0px_128.191px_50.87px_0px_rgba(0,0,0,0.00),0px_72.235px_42.73px_0px_rgba(0,0,0,0.01),0px_31.539px_31.539px_0px_rgba(0,0,0,0.02),0px_8.139px_17.296px_0px_rgba(0,0,0,0.02)]"
                        src="/images/landing/boxes/buyer-happy.png"
                        alt="Features Section One Box Image"
                        style="display: contents;"
                    />
                    <app-lazy-image-widget
                        className="lg:block hidden rounded-xl absolute left-24 top-3.5 w-[15rem] shadow-[0px_200.426px_55.957px_0px_rgba(0,0,0,0.00),0px_128.191px_50.87px_0px_rgba(0,0,0,0.00),0px_72.235px_42.73px_0px_rgba(0,0,0,0.01),0px_31.539px_31.539px_0px_rgba(0,0,0,0.02),0px_8.139px_17.296px_0px_rgba(0,0,0,0.02)]"
                        src="/images/landing/boxes/fruits.png"
                        alt="Features Section One Box Image"
                        style="display: contents;"
                    />
                    <app-lazy-image-widget
                        className="lg:block hidden rounded-xl absolute left-96 top-24 w-[14rem] shadow-[0px_179.87px_50.217px_0px_rgba(0,0,0,0.00),0px_115.043px_45.652px_0px_rgba(0,0,0,0.00),0px_64.826px_38.348px_0px_rgba(0,0,0,0.01),0px_28.304px_28.304px_0px_rgba(0,0,0,0.02),0px_7.304px_15.522px_0px_rgba(0,0,0,0.02)]"
                        src="/images/landing/boxes/usd-chart-dark.png"
                        alt="Features Section One Box Image"
                        style="display: contents;"
                    />
                </div>
                <div class="max-w-[31.5rem] lg:max-w-md mx-auto w-full flex flex-col items-center lg:items-start">
                    <div class="badge mx-0">About FreshBridge</div>
                    <h4 class="title-h5 md:title-h4 text-center lg:text-left mt-4 max-w-xs md:max-w-lg">Empowering Farm-to-Fork Commerce in Canada</h4>
                    <p class="body-small md:body-medium text-center lg:text-left mt-6">
                        FreshBridge (formerly FreshConnect) is a logistics-enabled online marketplace built to modernize the Canadian agricultural supply chain. From real-time produce listings to order management and last-mile delivery, we make it
                        easy for farmers and food buyers to connect, trade, and grow — together.
                    </p>
                    <a routerLink="/landing" class="body-button mt-8">Get Started</a>
                </div>
            </div>
        </section>
    `
})
export class SectionOneWidget {
    layoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());
}
