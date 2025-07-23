import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TextareaModule } from 'primeng/textarea';
import { HorizontalGridWidget } from '@/pages/UI-component/landing/components/horizontalgridwidget';
import { CustomersLogoWidget } from '@/pages/UI-component/landing/components/customerslogowidget';

@Component({
    selector: 'app-contact-hero-widget',
    standalone: true,
    imports: [CommonModule, HorizontalGridWidget, FormsModule, CustomersLogoWidget, InputTextModule, RadioButtonModule, TextareaModule],
    template: `
        <section class="animate-fadein animate-duration-300 animate-ease-in relative lg:pb-14 lg:pt-52 pt-36 pb-10">
            <app-horizontal-grid-widget class="top-[24rem] lg:top-[26rem]"></app-horizontal-grid-widget>
            <div class="landing-container mx-auto relative z-10">
                <h1 class="title-h4 lg:title-h1">
                    Connect with Our<br />
                    <span class="text-primary-600">Customer Support Team</span>
                </h1>
                <p class="body-small lg:body-medium mt-4 lg:mt-6 max-w-xs sm:max-w-lg lg:max-w-xl mx-auto">Our dedicated customer support team is here to assist you with any inquiries or assistance you may need.</p>
                <div
                    class="mt-12 lg:mt-28 mb-16 lg:mb-24 max-w-xl lg:max-w-6xl mx-auto flex lg:flex-row flex-col-reverse rounded-2xl overflow-hidden border border-surface-200 dark:border-surface-800 shadow-[0px_12px_24px_0px_rgba(0,0,0,0.04),0px_1px_2px_0px_rgba(18,18,23,0.05)]"
                >
                    <div class="overflow-hidden relative min-h-[30rem] lg:max-w-md w-full flex flex-col justify-between bg-primary-600 px-10 lg:px-11 py-10">
                        <img src="/images/landing/pattern-c.png" class="absolute top-[20rem] lg:top-[26rem] -left-[16rem] lg:-left-[16rem] w-[42rem] rotate-180 z-0 select-none" />
                        <img src="/images/landing/pattern-c.png" class="absolute rotate-45 -top-[28rem] lg:-top-[18rem] left-[18rem] w-[42rem] z-0 select-none" />
                        <div class="relative z-10">
                            <h6 class="title-h6 text-left text-surface-0">Contact Information</h6>
                            <p class="mt-2 body-large text-left text-surface-0/80">Have questions or want to join the platform?</p>
                            <div class="mt-10 flex flex-col gap-6">
                                <div class="flex items-center gap-3 text-surface-0">
                                    <i class="pi pi-phone !text-lg !leading-none"></i>
                                    <span class="body-small text-surface-0">+1000 0000 000</span>
                                </div>
                                <div class="flex items-center gap-3 text-surface-0">
                                    <i class="pi pi-envelope !text-lg !leading-none"></i>
                                    <span class="body-small text-surface-0">hello&#64;freshbridge.ca</span>
                                </div>
                                <div class="flex items-center gap-3 text-surface-0">
                                    <i class="pi pi-map-marker !text-lg !leading-none"></i>
                                    <span class="body-small text-surface-0">Toronto, ON</span>
                                </div>
                            </div>
                        </div>
                        <div class="relative z-10 flex items-center gap-2">
                            <a *ngFor="let s of socials" [href]="s.href" class="flex items-center justify-center px-4 py-1 rounded-full border border-surface-0/50 text-surface-0 hover:bg-surface-0/15 transition-all">
                                <i [class]="s.icon" class="!leading-none"></i>
                            </a>
                        </div>
                    </div>

                    <div class="flex-1 p-6 lg:p-14 bg-surface-0 dark:bg-surface-950">
                        <form class="flex flex-col gap-10">
                            <div class="grid grid-cols-2 gap-3.5 lg:gap-7">
                                <input type="text" pInputText placeholder="First Name" [(ngModel)]="first_name" name="firstName" required />
                                <input type="text" pInputText placeholder="Last Name" [(ngModel)]="last_name" name="lastName" required />
                                <input type="email" pInputText placeholder="Email Address" [(ngModel)]="email" name="email" required />
                                <input type="text" pInputText placeholder="Phone Number" [(ngModel)]="phone" name="phone" required />
                            </div>

                            <div>
                                <label class="label-medium">Select Subject?</label>
                                <div class="flex items-center flex-wrap gap-4 mt-4">
                                    <div *ngFor="let s of subjects" class="flex items-center">
                                        <p-radiobutton type="radio" [id]="s.key" name="subject" [(ngModel)]="selectedSubject" [value]="s.name" />
                                        <label [for]="s.key" class="ml-2 flex-1 text-sm text-surface-950 dark:text-surface-0 cursor-pointer">{{ s.name }}</label>
                                    </div>
                                </div>
                            </div>

                            <textarea pTextarea class="resize-none" placeholder="Message" [(ngModel)]="message" name="message" rows="5" cols="30" required></textarea>

                            <button class="body-button w-full" type="submit">Get Started</button>
                        </form>
                    </div>
                </div>

                <app-customers-logo-widget></app-customers-logo-widget>
            </div>
        </section>
    `
})
export class ContactHeroWidget {
    first_name = '';
    last_name = '';
    email = '';
    phone = '';
    message = '';
    selectedSubject = 'Farmer';

    subjects = [
        { name: 'Farmer', key: 'farmers' },
        { name: 'Buyer', key: 'buyer' }
    ];

    socials = [
        { icon: 'pi pi-youtube', href: '#' },
        { icon: 'pi pi-twitter', href: '#' },
        { icon: 'pi pi-discord', href: '#' }
    ];
}
