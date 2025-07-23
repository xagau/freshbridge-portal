import { HeroWidget } from '@/pages/UI-component/landing/components/herowidget';
import { Component, inject } from '@angular/core';
import { SectionOneWidget } from '@/pages/UI-component/landing/components/sectiononewidget';
import { SectionTwoWidget } from '@/pages/UI-component/landing/components/sectiontwowidget';
import { SectionThreeWidget } from '@/pages/UI-component/landing/components/sectionthreewidget';
import { CtaWidget } from '@/pages/UI-component/landing/components/ctawidget';
import { TestimonialWidget } from '@/pages/UI-component/landing/components/testimonialwidget';
import { FaqWidget } from '@/pages/UI-component/landing/components/faqwidget';
import { AppConfigurator } from '@/layout/components/app.configurator';
import { LayoutService } from '@/layout/service/layout.service';

@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [HeroWidget, SectionOneWidget, SectionTwoWidget, SectionThreeWidget, CtaWidget, TestimonialWidget, FaqWidget, AppConfigurator],
    template: `<app-hero-widget />
        <app-section-one-widget />
        <app-section-two-widget />
        <app-section-three-widget />
        <app-cta-widget />
        <app-testimonial-widget />
        <app-faq-widget />
        <!-- <button class="layout-config-button config-link" (click)="layoutService.toggleConfigSidebar()">
            <i class="pi pi-cog"></i>
        </button> -->
        <app-configurator location="landing" />`
})
export class LandingPage {
    layoutService: LayoutService = inject(LayoutService);
}
