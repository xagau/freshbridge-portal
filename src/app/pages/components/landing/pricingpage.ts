import { Component, inject } from '@angular/core';
import { CtaWidget } from '@/pages/components/landing/components/ctawidget';
import { PricingCompareWidget } from '@/pages/components/landing/components/pricing/pricingcomparewidget';
import { TestimonialWidget } from '@/pages/components/landing/components/testimonialwidget';
import { PricingHeroWidget } from '@/pages/components/landing/components/pricing/pricingherowidget';
import { AppConfigurator } from '@/layout/components/app.configurator';
import { LayoutService } from '@/layout/service/layout.service';

@Component({
    selector: 'app-pricing-page',
    standalone: true,
    imports: [PricingHeroWidget, PricingCompareWidget, CtaWidget, TestimonialWidget, AppConfigurator],
    template: `
        <app-pricing-hero-widget />
        <app-pricing-compare-widget />
        <app-cta-widget />
        <app-testimonial-widget />
        <!-- <button class="layout-config-button config-link" (click)="layoutService.toggleConfigSidebar()">
            <i class="pi pi-cog"></i>
        </button> -->
        <app-configurator location="landing" />
    `
})
export class PricingPage {
    layoutService: LayoutService = inject(LayoutService);
}
