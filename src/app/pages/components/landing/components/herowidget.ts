import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input } from '@angular/core';
import { HorizontalGridWidget } from './horizontalgridwidget';
import { LazyImageWidget } from '@/pages/components/landing/components/lazyimagewidget';
import { CustomersLogoWidget } from '@/pages/components/landing/components/customerslogowidget';
import { LayoutService } from '@/layout/service/layout.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-hero-widget',
    standalone: true,
    imports: [CommonModule, HorizontalGridWidget, LazyImageWidget, CustomersLogoWidget, RouterLink],
    template: `
        <section class="animate-fadein animate-duration-300 animate-ease-in relative lg:pb-14 lg:pt-52 pt-36 pb-10">
            <app-horizontal-grid-widget class="top-[27rem] lg:top-[26rem]"></app-horizontal-grid-widget>
            <div class="relative z-10 mx-auto landing-container overflow-hidden">
                <div class="flex flex-col items-center">
                    <h1 class="title-h4 lg:title-h1">
                        Canada’s Local Food Marketplace <br />
                        <span class="text-primary-600">with Innovative Ideas</span>
                    </h1>
                    <p class="body-small lg:body-medium mt-4 lg:mt-6 max-w-lg">FreshBridge connects Canadian merchants with buyers, grocers, and institutions — streamlining trade, logistics, and payment in a trusted online ecosystem.</p>
                    <a routerLink="/auth/register" class="body-button mt-6 lg:mt-8">Join Now</a>
                </div>
                <div class="mb-20 lg:mb-28">
                    <app-lazy-image-widget
                        [src]="'/images/landing/' + (isDarkTheme() ? 'hero-dashboard-dark.png' : 'hero-dashboard.png')"
                        alt="Hero Image"
                        className="mt-16 min-w-[42rem] !max-w-[71rem] w-full h-auto mx-auto rounded-xl lg:rounded-3xl shadow-[0px_4px_16px_0px_rgba(18,18,23,0.08),0px_0px_0px_8px_#E3E8EF] dark:shadow-[0px_4px_16px_0px_rgba(18,18,23,0.08),0px_0px_0px_8px_#27272A]"
                    ></app-lazy-image-widget>
                </div>
                <app-customers-logo-widget></app-customers-logo-widget>
            </div>
        </section>
    `
})
export class HeroWidget {
    layoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());
}
