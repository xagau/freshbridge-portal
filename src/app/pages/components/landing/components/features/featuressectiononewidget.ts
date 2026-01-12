import { Component, computed, inject } from '@angular/core';
import { LayoutService } from '@/layout/service/layout.service';
import { LazyImageWidget } from '@/pages/components/landing/components/lazyimagewidget';

@Component({
    selector: 'app-features-section-one-widget',
    standalone: true,
    imports: [LazyImageWidget],
    template: `
        <section class="landing-container relative py-12 lg:py-24">
            <div class="max-w-[68rem] mx-auto flex lg:flex-row flex-col items-center gap-14 xl:gap-20">
                <div class="relative lg:flex-1 h-[27rem] lg:h-[34.6rem] w-full max-w-[25rem] lg:max-w-[32rem]">
                    <app-lazy-image-widget
                        className="w-[19rem] lg:w-[24rem] z-0 rounded-2xl delay-300 h-auto absolute rotate-[-22deg] bottom-10 lg:bottom-12 left-12 lg:left-16 shadow-[0px_20px_52px_0px_rgba(0,0,0,0.04),0px_112px_31px_0px_rgba(0,0,0,0.00),0px_72px_29px_0px_rgba(0,0,0,0.01)]"
                        [src]="'/images/landing/boxes/' + (isDarkTheme() ? 'spending-limit-dark.png' : 'spending-limit.png')"
                        alt="Features Section One Box Image"
                        style="display:contents"
                    />
                    <app-lazy-image-widget
                        className="w-[18rem] lg:w-[23rem] rounded-2xl z-10 h-auto absolute top-0 right-0 shadow-[0px_20px_52px_0px_rgba(0,0,0,0.04),0px_112px_31px_0px_rgba(0,0,0,0.00),0px_72px_29px_0px_rgba(0,0,0,0.01)]"
                        [src]="'/images/landing/boxes/' + (isDarkTheme() ? 'credit-score-dark.png' : 'credit-score.png')"
                        alt="Features Section One Box Image"
                        style="display:contents"
                    />
                </div>
                <div class="max-w-[25rem] lg:max-w-md mx-auto w-full flex flex-col items-center lg:items-start">
                    <div class="badge mx-0">Feature</div>
                    <h4 class="title-h5 lg:title-h4 text-center lg:text-left mt-4">Partnerships & Pilots</h4>
                    <p class="body-medium text-center lg:text-left mt-6">FreshBridge collaborates with:</p>
                    <ul class="list-disc mt-8 body-medium text-center lg:text-left list-inside space-y-3.5">
                        <li>Local municipalities & food policy councils</li>
                        <li>Agricultural co-ops and CSA networks</li>
                        <li>National logistics & cold-chain partners</li>
                        <li>Sustainability and food justice groups</li>
                    </ul>
                </div>
            </div>
        </section>
    `
})
export class FeaturesSectionOneWidget {
    layoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());
}
