import { CtaWidget } from '@/pages/components/landing/components/ctawidget';
import { FaqWidget } from '@/pages/components/landing/components/faqwidget';
import { FeaturesHeroWidget } from '@/pages/components/landing/components/features/featuresherowidget';
import { TestimonialWidget } from '@/pages/components/landing/components/testimonialwidget';
import { Component, inject } from '@angular/core';
import { FeaturesSectionOneWidget } from '@/pages/components/landing/components/features/featuressectiononewidget';
import { FeaturesSectionTwoWidget } from '@/pages/components/landing/components/features/featuressectiontwowidget';
import { AppConfigurator } from '@/layout/components/app.configurator';
import { LayoutService } from '@/layout/service/layout.service';

@Component({
    selector: 'app-features-page',
    standalone: true,
    imports: [CtaWidget, FaqWidget, TestimonialWidget, FeaturesHeroWidget, FeaturesSectionOneWidget, FeaturesSectionTwoWidget, AppConfigurator],
    template: `
        <app-features-hero-widget />
        <app-features-section-one-widget />
        <app-features-section-two-widget />
        <app-cta-widget />
        <app-testimonial-widget />
        <app-faq-widget />
        <!-- <button class="layout-config-button config-link" (click)="layoutService.toggleConfigSidebar()">
            <i class="pi pi-cog"></i>
        </button> -->
        <app-configurator location="landing" />
    `
})
export class FeaturesPage {
    layoutService: LayoutService = inject(LayoutService);
}
