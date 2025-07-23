import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { LayoutService } from '@/layout/service/layout.service';
import { LazyImageWidget } from '@/pages/UI-component/landing/components/lazyimagewidget';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-section-two-widget',
    standalone: true,
    imports: [CommonModule, LazyImageWidget, RouterLink],
    template: `
        <section class="max-w-[72rem] mx-auto landing-container relative py-12 lg:py-24">
            <div class="flex lg:flex-row-reverse flex-col items-center gap-14 lg:gap-4 xl:gap-10">
                <div class="relative lg:flex-1 h-[23rem] lg:h-[42rem] w-full max-w-[25rem] lg:max-w-[42rem]">
                    <app-lazy-image-widget
                        className="lg:block hidden rounded-xl absolute h-full w-auto top-0 left-0 scale-x-[-1]"
                        [src]="'/images/landing/' + (isDarkTheme() ? 'landing-section-pattern-dark.png' : 'landing-section-pattern.png')"
                        alt="Features Section One Box Image"
                        style="display: contents;"
                    />

                    <app-lazy-image-widget
                        className="rounded-2xl absolute left-0 lg:left-14 top-0 lg:top-[16.6rem] w-[20rem] shadow-[0px_200.426px_55.957px_0px_rgba(0,0,0,0.00),0px_128.191px_50.87px_0px_rgba(0,0,0,0.00),0px_72.235px_42.73px_0px_rgba(0,0,0,0.01),0px_31.539px_31.539px_0px_rgba(0,0,0,0.02),0px_8.139px_17.296px_0px_rgba(0,0,0,0.02)]"
                        [src]="'/images/landing/boxes/' + (isDarkTheme() ? 'spending-limit-dark.png' : 'spending-limit.png')"
                        alt="Features Section One Box Image"
                        style="display: contents;"
                    />

                    <app-lazy-image-widget
                        className="lg:block hidden rounded-xl absolute left-[25rem] top-[26rem] w-[10.7rem] shadow-[0px_0.581px_1.163px_0px_rgba(18,18,23,0.05)]"
                        [src]="'/images/landing/boxes/' + (isDarkTheme() ? 'try-chart-dark.png' : 'try-chart.png')"
                        alt="Features Section One Box Image"
                        style="display: contents;"
                    />

                    <app-lazy-image-widget
                        className="rounded-xl absolute left-48 lg:left-[26rem] top-20 lg:top-[15rem] w-[12.8rem] shadow-[0px_179.091px_50px_0px_rgba(0,0,0,0.00),0px_114.545px_45.455px_0px_rgba(0,0,0,0.00),0px_64.545px_38.182px_0px_rgba(0,0,0,0.01),0px_28.182px_28.182px_0px_rgba(0,0,0,0.02),0px_7.273px_15.455px_0px_rgba(0,0,0,0.02),0px_0.698px_1.395px_0px_rgba(18,18,23,0.05)]"
                        [src]="'/images/landing/boxes/' + (isDarkTheme() ? 'eur-chart-dark.png' : 'eur-chart.png')"
                        alt="Features Section One Box Image"
                        style="display: contents;"
                    />

                    <app-lazy-image-widget
                        className="lg:block hidden rounded-xl absolute left-[21.5rem] top-[5.5rem] w-[12.5rem] shadow-[0px_179.557px_50.13px_0px_rgba(0,0,0,0.00),0px_114.844px_45.573px_0px_rgba(0,0,0,0.00),0px_64.714px_38.281px_0px_rgba(0,0,0,0.01),0px_28.255px_28.255px_0px_rgba(0,0,0,0.02),0px_7.292px_15.495px_0px_rgba(0,0,0,0.02),0px_0.678px_1.357px_0px_rgba(18,18,23,0.05)]"
                        [src]="'/images/landing/boxes/' + (isDarkTheme() ? 'gbp-chart-dark.png' : 'gbp-chart.png')"
                        alt="Features Section One Box Image"
                        style="display: contents;"
                    />

                    <app-lazy-image-widget
                        className="rounded-xl absolute left-[12.75rem] lg:left-[7.5rem] bottom-0 lg:bottom-auto lg:top-[7rem] w-[11.6rem] shadow-[0px_167.245px_46.693px_0px_rgba(0,0,0,0.00),0px_106.969px_42.448px_0px_rgba(0,0,0,0.00),0px_60.276px_35.656px_0px_rgba(0,0,0,0.01),0px_26.318px_26.318px_0px_rgba(0,0,0,0.02),0px_6.792px_14.432px_0px_rgba(0,0,0,0.02),0px_0.632px_1.264px_0px_rgba(18,18,23,0.05)]"
                        [src]="'/images/landing/boxes/' + (isDarkTheme() ? 'usd-chart-dark.png' : 'usd-chart.png')"
                        alt="Features Section One Box Image"
                        style="display: contents;"
                    />
                </div>
                <div class="max-w-[31.5rem] lg:max-w-md mx-auto w-full flex flex-col items-center lg:items-start">
                    <div class="badge mx-0">Financial Management</div>
                    <h4 class="title-h5 md:title-h4 text-center lg:text-left mt-4">🌱 Why FreshBridge?</h4>
                    <p class="body-small md:body-medium text-center lg:text-left mt-6">We’re not just a platform. We’re infrastructure for a new food economy.</p>
                    <ul class="list-disc list-inside body-small lg:body-medium text-center lg:text-left mt-8 space-y-3.5">
                        <li>Higher profits for small-to-medium farms</li>
                        <li>Better access for local restaurants & retailers</li>
                        <li>Lower waste and fewer intermediaries.</li>
                        <li>Smart delivery from field to fork</li>
                        <li>Built by Canadians, for Canadian agriculture</li>
                    </ul>
                    <a routerLink="/landing" class="body-button mt-8">Join Now</a>
                </div>
            </div>
        </section>
    `
})
export class SectionTwoWidget {
    layoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());
}
