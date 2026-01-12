import { Component, OnInit } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'app-faq',
    imports: [AccordionModule, CommonModule, RippleModule],
    template: `
        <div>
            <div>
                <h1 class="title-h4">
                    Frequently<br />
                    <span class="text-primary-600">Asked Questions</span>
                </h1>
                <p class="mt-3.5 max-w-md mx-auto body-small">Get clear answers and helpful guidance on the most common questions about our services and products.</p>
            </div>

            <div class="max-w-6xl mx-auto mt-16 flex flex-col md:flex-row items-start gap-6">
                <div class="card p-5 flex flex-col gap-3 md:max-w-80 w-full">
                    <button *ngFor="let item of items; let i = index" (click)="changeItem(i)" class="mb-2 ">
                        <a
                            class="flex items-center cursor-pointer select-none p-4 transition-colors duration-150 rounded-border"
                            [ngClass]="{
                                'bg-primary text-primary-contrast': activeIndex === i,
                                'hover:bg-surface-100 dark:hover:bg-surface-800': activeIndex !== i
                            }"
                        >
                            <i [class]="item.icon" class="mr-2 text-lg"></i>
                            <span>{{ item.label }}</span>
                        </a>
                    </button>
                </div>
                <div class="card flex-1">
                    <p-accordion>
                        @for (question of items[activeIndex].questions; track question; let i = $index) {
                            <p-accordion-panel [value]="items[i].value">
                                <p-accordion-header>{{ question }}</p-accordion-header>
                                <p-accordion-content>
                                    <p class="body-medium text-left text-base">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                                        ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                                        mollit anim id est laborum.
                                    </p>
                                </p-accordion-content>
                            </p-accordion-panel>
                        }
                    </p-accordion>
                </div>
            </div>
        </div>
    `
})
export class Faq implements OnInit {
    items: any[] = [];

    activeIndex: number = 0;

    constructor() {}

    ngOnInit(): void {
        this.items = [
            {
                label: 'General',
                icon: 'pi pi-fw pi-info-circle',
                questions: ['Is there a trial period?', 'Do I need to sign up with credit card?', 'Is the subscription monthly or annual?', 'How many tiers are there?'],
                value: '0'
            },
            {
                label: 'Mailing',
                icon: 'pi pi-fw pi-envelope',
                questions: ['How do I setup my account?', 'Is there a limit on mails to send?', 'What is my inbox size?', 'How can I add attachements?'],
                value: '1'
            },
            {
                label: 'Support',
                icon: 'pi pi-fw pi-question-circle',
                questions: ['How can I get support?', 'What is the response time?', 'Is there a community forum?', 'Is live chat available?'],
                value: '2'
            },
            {
                label: 'Billing',
                icon: 'pi pi-fw pi-credit-card',
                questions: ['Will I receive an invoice?', 'How to provide my billing information?', 'Is VAT included?', 'Can I receive PDF invoices?'],
                value: '3'
            }
        ];
    }

    changeItem(i: number) {
        this.activeIndex = i;
    }
}
