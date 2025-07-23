import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyImageWidget } from '@/pages/UI-component/landing/components/lazyimagewidget';

@Component({
    selector: 'app-contact-adress-widget',
    standalone: true,
    imports: [CommonModule, LazyImageWidget],
    template: `
        <section class="landing-container mx-auto py-10 lg:py-20">
            <div class="max-w-xl lg:max-w-6xl mx-auto flex lg:flex-row flex-col gap-7">
                <div *ngFor="let data of contactInfo; let index = index" class="flex-1 p-3.5 rounded-3xl border border-surface-200 dark:border-surface-800 shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)]">
                    <app-lazy-image-widget className="max-h-96 w-full h-full object-cover rounded-2xl shadow-[0px_1px_2px_0px_rgba(69,69,69,0.24),0px_0px_0px_1px_rgba(71,71,71,0.08)]" [src]="data.image" alt="Contact Address Image" />
                    <div class="py-6 px-3.5 lg:p-7">
                        <span class="title-h7">{{ data.title }}</span>
                        <p class="body-medium text-left mt-4">{{ data.address }}</p>
                        <p class="body-medium text-left mt-2">{{ data.phone }}</p>
                    </div>
                </div>
            </div>
        </section>
    `
})
export class ContactAdressWidget {
    contactInfo = [
        {
            title: 'California',
            address: '3456 Lime Dr, Feigncity, FL, 33333',
            phone: '(400) 000 - 0000',
            image: '/images/landing/contact-address-1.jpg'
        },
        {
            title: 'Australia',
            address: 'Sydney, Australia, 2000',
            phone: '(400) 000 - 0000',
            image: '/images/landing/contact-address-2.jpg'
        }
    ];
}
