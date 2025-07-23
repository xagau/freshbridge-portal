import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutService } from '@/layout/service/layout.service';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';

@Component({
    selector: 'app-contact-us',
    imports: [CommonModule, FormsModule, InputTextModule, TextareaModule, ButtonModule, IconField, InputIcon],
    template: `
        <div class="grid grid-cols-12 gap-4 card grid-nogutter" style="column-gap: 2rem; row-gap: 2rem;">
            <div class="col-span-12">
                <p class="text-surface-900 dark:text-surface-0 font-bold">Contact Us</p>
            </div>
            <div class="col-span-12 mt-4 h-80 border border-surface p-0 w-full bg-cover rounded-border" [ngStyle]="mapStyle"></div>
            <div class="col-span-12 mt-8">
                <div class="flex gap-4 px-2 flex-col md:flex-row" style="column-gap: 2rem; row-gap: 2rem;">
                    <div *ngFor="let item of content" class="md:w-1/3 flex flex-col justify-center text-center items-center border border-surface-200 dark:border-surface-700 py-8 px-6 rounded">
                        <i class="pi pi-fw text-2xl text-primary" [class]="item.icon"></i>
                        <span class="text-surface-900 dark:text-surface-0 font-bold mt-6 mb-1">{{ item.title }}</span>
                        <span class="text-surface-500 dark:text-surface-300">{{ item.info }}</span>
                    </div>
                </div>
            </div>

            <div class="col-span-12 mt-8">
                <p class="text-surface-900 dark:text-surface-0 font-bold">Send Us Email</p>
                <div class="grid gap-4 flex-col md:flex-row grid-nogutter mt-12" style="row-gap: 2rem; column-gap: 2rem;">
                    <div class="col-span-6 flex flex-col">
                        <label for="name" class="block font-bold text-surface-500">Name</label>
                        <p-icon-field class="mt-2" [style]="{ height: '3.5rem' }">
                            <p-inputicon class="pi pi-user" [style]="{ left: '1.5rem' }" />
                            <input pInputText id="name" type="text" [(ngModel)]="name" placeholder="Name" class="w-full !pl-16 text-surface-900 dark:text-surface-0 font-semibold" [style]="{ height: '3.5rem' }" />
                        </p-icon-field>
                    </div>

                    <div class="col-span-6 flex flex-col">
                        <label for="email" class="block font-bold text-surface-500">Email Address</label>
                        <p-icon-field class="mt-2" [style]="{ height: '3.5rem' }">
                            <p-inputicon class="pi pi-envelope" [style]="{ left: '1.5rem' }" />
                            <input pInputText id="email" type="text" [(ngModel)]="email" placeholder="Email" class="w-full !pl-16 text-surface-900 dark:text-surface-0 font-semibold" [style]="{ height: '3.5rem' }" />
                        </p-icon-field>
                    </div>

                    <div class="col-span-12 flex flex-col">
                        <label for="message" class="block font-bold text-surface-500">Message</label>
                        <textarea id="message" rows="5" pTextarea class="w-full mt-2 border-surface p-12 text-surface-900 dark:text-surface-0 font-semibold rounded-border" [autoResize]="true" [(ngModel)]="message"></textarea>
                        <button pButton class="p-button-primary ml-auto mt-4 rounded-border" label="Send Message"></button>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ContactUs {
    options: any;

    name: string = '';

    email: string = '';

    message: string = '';

    content: any[] = [
        { icon: 'pi pi-fw pi-phone', title: 'Phone', info: '1 (833) 597-7538' },
        {
            icon: 'pi pi-fw pi-map-marker',
            title: 'Our Head Office',
            info: 'Churchill-laan 16 II, 1052 CD, Amsterdam'
        },
        { icon: 'pi pi-fw pi-print', title: 'Fax', info: '3 (833) 297-1548' }
    ];

    constructor(private layoutService: LayoutService) {}

    get mapStyle() {
        return {
            'background-image': this.layoutService.isDarkTheme() ? "url('/images/contact/map-dark.svg')" : "url('https://primefaces.org/cdn/v2/images/contact/map-light.svg')"
        };
    }
}
