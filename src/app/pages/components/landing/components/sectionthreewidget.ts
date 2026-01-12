import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { LazyImageWidget } from '@/pages/components/landing/components/lazyimagewidget';
import { LayoutService } from '@/layout/service/layout.service';

@Component({
    selector: 'app-section-three-widget',
    standalone: true,
    imports: [CommonModule, LazyImageWidget],
    template: `
        <section class="relative py-12 lg:py-24">
            <div class="landing-container mx-auto w-full flex flex-col items-center">
                <div class="badge mx-0">Key Features</div>
                <h4 class="title-h4 lg:title-h2 text-center mt-6">Fresh Produce <span class="text-primary-600">Dashboard</span></h4>
                <p class="body-small md:body-large text-center mt-6 max-w-[56rem]">
                    Efficiently manage and track all changes with robust version control tools. Collaborate seamlessly with your team through branching, merging, and conflict resolution features. Ensure data integrity and easy rollback to previous
                    versions for safer development workflows.
                </p>
            </div>
            <div class="scale-50 md:scale-75 lg:scale-100 w-full h-[50rem] md:h-[68rem] lg:h-auto -mt-48 md:-mt-32 lg:mt-0">
                <div class="w-full h-[71.6rem] relative mt-1">
                    <div class="absolute scale-100 top-0 left-1/2 -translate-x-1/2 h-full w-[102rem] mx-auto flex items-end justify-end overflow-hidden">
                        <div
                            class="z-10 absolute top-0 w-full h-[16rem] lg:h-[18rem] [background:linear-gradient(0deg,rgba(255,255,255,0.00)_0%,var(--p-surface-0)_84.42%,var(--p-surface-0)_100%)] dark:[background:linear-gradient(0deg,rgba(255,255,255,0.00)_0%,var(--p-surface-950)_84.42%,var(--p-surface-950)_100%)] transition-all"
                        ></div>
                        <div
                            class="z-10 absolute bottom-0 w-full h-[32rem] lg:h-[36rem] [background:linear-gradient(180deg,rgba(255,255,255,0.00)_0%,var(--p-surface-0)_39.73%,var(--p-surface-0)_100%)] dark:[background:linear-gradient(180deg,rgba(255,255,255,0.00)_0%,var(--p-surface-950)_39.73%,var(--p-surface-950)_100%)] transition-all"
                        ></div>
                        <div class="z-[2] absolute top-[10rem] left-[15rem] animate-float">
                            <app-lazy-image-widget
                                className="rounded-3xl w-[25rem] rotate-[-16deg] shadow-[0px_112px_31px_0px_rgba(0,0,0,0.00),0px_72px_29px_0px_rgba(0,0,0,0.01),0px_40px_24px_0px_rgba(0,0,0,0.03),0px_18px_18px_0px_rgba(0,0,0,0.05),0px_4px_10px_0px_rgba(0,0,0,0.06),0px_0.697px_1.394px_0px_rgba(18,18,23,0.05),0px_0.569px_1.139px_0px_rgba(18,18,23,0.05),0px_1px_2px_0px_rgba(18,18,23,0.05)]"
                                [src]="'/images/landing/boxes/' + (isDarkTheme() ? 'credit-score-dark.png' : 'credit-score.png')"
                                alt="Features Section One Box Image"
                            />
                        </div>
                        <div class="z-[3] absolute top-[7rem] left-[32rem]">
                            <app-lazy-image-widget
                                className="rounded-2xl w-[25rem] rotate-[-8deg] shadow-[0px_112px_31px_0px_rgba(0,0,0,0.00),0px_72px_29px_0px_rgba(0,0,0,0.01),0px_40px_24px_0px_rgba(0,0,0,0.03),0px_18px_18px_0px_rgba(0,0,0,0.05),0px_4px_10px_0px_rgba(0,0,0,0.06),0px_0.697px_1.394px_0px_rgba(18,18,23,0.05),0px_0.569px_1.139px_0px_rgba(18,18,23,0.05)]"
                                [src]="'/images/landing/boxes/' + (isDarkTheme() ? 'sales-rate-dark.png' : 'sales-rate.png')"
                                alt="Features Section One Box Image"
                            />
                        </div>
                        <div class="z-[4] absolute top-[8.5rem] left-[41.5rem] animate-float animate-delay-1000">
                            <app-lazy-image-widget
                                className="rounded-3xl w-[25rem] rotate-[5deg] shadow-[0px_112px_31px_0px_rgba(0,0,0,0.00),0px_72px_29px_0px_rgba(0,0,0,0.01),0px_40px_24px_0px_rgba(0,0,0,0.03),0px_18px_18px_0px_rgba(0,0,0,0.05),0px_4px_10px_0px_rgba(0,0,0,0.06),0px_0.697px_1.394px_0px_rgba(18,18,23,0.05),0px_0.569px_1.139px_0px_rgba(18,18,23,0.05)]"
                                [src]="'/images/landing/boxes/' + (isDarkTheme() ? 'social-media-users-dark.png' : 'social-media-users.png')"
                                alt="Features Section One Box Image"
                            />
                        </div>
                        <div class="z-[3] absolute top-[10.3rem] left-[66rem] animate-float animate-delay-300">
                            <app-lazy-image-widget
                                className="rounded-2xl w-[25rem] rotate-[22deg] shadow-[0px_112px_31px_0px_rgba(0,_0,_0,_0.00),_0px_72px_29px_0px_rgba(0,_0,_0,_0.01),_0px_40px_24px_0px_rgba(0,_0,_0,_0.03),_0px_18px_18px_0px_rgba(0,_0,_0,_0.05),_0px_4px_10px_0px_rgba(0,_0,_0,_0.06),_0px_0.697px_1.394px_0px_rgba(18,_18,_23,_0.05),_0px_0.569px_1.139px_0px_rgba(18,_18,_23,_0.05)]"
                                [src]="'/images/landing/boxes/' + (isDarkTheme() ? 'new-customer-dark.png' : 'new-customer.png')"
                                alt="Features Section One Box Image"
                            />
                        </div>
                        <div class="z-[4] absolute top-[30rem] left-[71rem] animate-float animate-delay-300 animate-duration-[8s]">
                            <app-lazy-image-widget
                                className="rounded-3xl w-[25rem] rotate-[-8.5deg] shadow-[0px_112px_31px_0px_rgba(0,_0,_0,_0.00),_0px_72px_29px_0px_rgba(0,_0,_0,_0.01),_0px_40px_24px_0px_rgba(0,_0,_0,_0.03),_0px_18px_18px_0px_rgba(0,_0,_0,_0.05),_0px_4px_10px_0px_rgba(0,_0,_0,_0.06),_0px_0.697px_1.394px_0px_rgba(18,_18,_23,_0.05),_0px_0.569px_1.139px_0px_rgba(18,_18,_23,_0.05),_0px_1px_2px_0px_rgba(18,_18,_23,_0.05)]"
                                [src]="'/images/landing/boxes/' + (isDarkTheme() ? 'spending-limit-dark.png' : 'spending-limit.png')"
                                alt="Features Section One Box Image"
                            />
                        </div>
                        <div class="z-[1] absolute top-[24.5rem] left-[3.8rem] animate-wiggle">
                            <app-lazy-image-widget
                                className="rounded-2xl w-[18.5rem] shadow-[0px_112px_31px_0px_rgba(0,_0,_0,_0.00),_0px_72px_29px_0px_rgba(0,_0,_0,_0.01),_0px_40px_24px_0px_rgba(0,_0,_0,_0.03),_0px_18px_18px_0px_rgba(0,_0,_0,_0.05),_0px_4px_10px_0px_rgba(0,_0,_0,_0.06),_0px_0.697px_1.394px_0px_rgba(18,_18,_23,_0.05),_0px_0.569px_1.139px_0px_rgba(18,_18,_23,_0.05)]"
                                [src]="'/images/landing/boxes/' + (isDarkTheme() ? 'try-chart-dark.png' : 'try-chart.png')"
                                alt="Features Section One Box Image"
                            />
                        </div>
                        <div class="z-[3] absolute top-[30.5rem] left-[29.5rem]">
                            <app-lazy-image-widget
                                className="rounded-3xl w-[18.5rem] rotate-[2.5deg] shadow-[0px_112px_31px_0px_rgba(0,_0,_0,_0.00),_0px_72px_29px_0px_rgba(0,_0,_0,_0.01),_0px_40px_24px_0px_rgba(0,_0,_0,_0.03),_0px_18px_18px_0px_rgba(0,_0,_0,_0.05),_0px_4px_10px_0px_rgba(0,_0,_0,_0.06),_0px_0.697px_1.394px_0px_rgba(18,_18,_23,_0.05),_0px_0.569px_1.139px_0px_rgba(18,_18,_23,_0.05),_0px_1px_2px_0px_rgba(18,_18,_23,_0.05)]"
                                [src]="'/images/landing/boxes/' + (isDarkTheme() ? 'eur-chart-dark.png' : 'eur-chart.png')"
                                alt="Features Section One Box Image"
                            />
                        </div>
                        <div class="z-[5] absolute top-[41.3rem] left-[51.3rem]">
                            <app-lazy-image-widget
                                className="rounded-2xl w-[18.5rem] rotate-[-14.5deg] shadow-[0px_1px_2px_0px_rgba(18,_18,_23,_0.05)]"
                                [src]="'/images/landing/boxes/' + (isDarkTheme() ? 'usd-chart-dark.png' : 'usd-chart.png')"
                                alt="Features Section One Box Image"
                            />
                        </div>
                        <div class="z-[1] absolute top-[28.8rem] left-[65rem] animate-wiggle animate-delay-[5s]">
                            <app-lazy-image-widget
                                className="rounded-3xl w-[18.5rem] rotate-[22deg] shadow-[0px_112px_31px_0px_rgba(0,_0,_0,_0.00),_0px_72px_29px_0px_rgba(0,_0,_0,_0.01),_0px_40px_24px_0px_rgba(0,_0,_0,_0.03),_0px_18px_18px_0px_rgba(0,_0,_0,_0.05),_0px_4px_10px_0px_rgba(0,_0,_0,_0.06),_0px_0.697px_1.394px_0px_rgba(18,_18,_23,_0.05),_0px_0.569px_1.139px_0px_rgba(18,_18,_23,_0.05),_0px_1px_2px_0px_rgba(18,_18,_23,_0.05)]"
                                [src]="'/images/landing/boxes/' + (isDarkTheme() ? 'gbp-chart-dark.png' : 'gbp-chart.png')"
                                alt="Features Section One Box Image"
                            />
                        </div>
                        <div class="z-[3] absolute top-[36.6rem] left-[1rem] animate-float animate-duration-[5s] animate-delay-[4s]">
                            <app-lazy-image-widget
                                className="rounded-3xl w-[52rem] rotate-[9.3deg] shadow-[0px_112px_31px_0px_rgba(0,_0,_0,_0.00),_0px_72px_29px_0px_rgba(0,_0,_0,_0.01),_0px_-40px_24px_0px_rgba(0,_0,_0,_0.02),_0px_-4px_18px_0px_rgba(0,_0,_0,_0.03),_0px_-4px_10px_0px_rgba(0,_0,_0,_0.04),_0px_0.697px_1.394px_0px_rgba(18,_18,_23,_0.03),_0px_0.569px_1.139px_0px_rgba(18,_18,_23,_0.03),_0px_-1px_2px_0px_rgba(18,_18,_23,_0.03)]"
                                [src]="'/images/landing/boxes/' + (isDarkTheme() ? 'income-dark.png' : 'income.png')"
                                alt="Features Section One Box Image"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div class="-mt-[8rem] md:-mt-[14rem] lg:-mt-[16rem] max-w-md px-6 md:landing-container w-full mx-auto relative z-50 grid grid-cols-1 md:grid-cols-2 lg:gap-7">
                <div *ngFor="let group of details" class="p-4 m-2 bg-surface-100 dark:bg-surface-800 rounded-lg shadow-md">
                    <!-- Subtitle with Icon -->
                    <div class="flex items-center gap-3 mb-4">
                        <div class="bg-primary w-12 h-10" [ngStyle]="{ mask: 'url(' + group.icon + ') no-repeat center' }"></div>
                        <h3 class="title-h5">{{ group.subtitle }}</h3>
                    </div>

                    <!-- Feature list -->
                    <ul class="list-disc list-inside space-y-2 text-surface-700 dark:text-surface-400 body-small text-left ml-2">
                        <li *ngFor="let feature of group.features">{{ feature }}</li>
                    </ul>
                </div>
            </div>
        </section>
    `
})
export class SectionThreeWidget {
    layoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());

    details = [
        {
            subtitle: 'For Farmers',
            icon: '/images/landing/icons/icon-1.svg',
            features: [
                'Instant access to local demand across Ontario.',
                'Real-time pricing, inventory tools, and order tracking.',
                'Smart logistics integration — from harvest to delivery.',
                'Built-in invoicing and secure payments.',
                'Data insights to grow margins and reduce waste.'
            ]
        },
        {
            subtitle: 'For Buyers',
            icon: '/images/landing/icons/icon-2.svg',
            features: [
                'Fresh, local produce from verified Canadian farms.',
                'Transparent pricing, real-time availability.',
                'One-click ordering and repeat deliveries.',
                'Consolidated invoicing and seamless delivery.',
                'Sustainability-focused sourcing with full traceability.'
            ]
        }
    ];
}
