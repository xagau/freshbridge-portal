import { Component, inject } from '@angular/core';
import { ContactHeroWidget } from '@/pages/components/landing/components/contact/contactherowidget';
import { AppConfigurator } from '@/layout/components/app.configurator';
import { LayoutService } from '@/layout/service/layout.service';

@Component({
    selector: 'app-contact-page',
    standalone: true,
    imports: [ContactHeroWidget, AppConfigurator],
    template: `
        <app-contact-hero-widget />
        <app-configurator location="landing" />
    `
})
export class ContactPage {
    layoutService: LayoutService = inject(LayoutService);
}
