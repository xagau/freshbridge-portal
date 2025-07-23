import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
@Component({
    selector: 'app-faq-widget',
    standalone: true,
    imports: [CommonModule, AccordionModule],
    template: `
        <section class="py-10 lg:py-28 landing-container mx-auto">
            <div class="w-full">
                <h3 class="title-h5 lg:title-h3">Frequently Asked Questions</h3>
                <div class="max-w-3xl lg:max-w-6xl mx-auto mt-10 p-4 lg:p-6 rounded-2xl border border-surface-200 dark:border-surface-800">
                    <p-accordion [value]="0" expandIcon="pi pi-plus" collapseIcon="pi pi-minus">
                        <p-accordion-panel *ngFor="let faq of faqs; let i = index" [value]="i">
                            <p-accordion-header>
                                <h5 class="label-medium">{{ faq.question }}</h5>
                            </p-accordion-header>
                            <p-accordion-content>
                                <p class="m-0 body-small text-left">{{ faq.answer }}</p>
                            </p-accordion-content>
                        </p-accordion-panel>
                    </p-accordion>
                </div>
            </div>
        </section>
    `
})
export class FaqWidget {
    faqs = [
        {
            question: 'How does FreshBridge help farmers?',
            answer: 'FreshBridge gives farmers access to a wide network of local buyers including restaurants and grocers. It simplifies pricing, order management, logistics, and payments — so farmers can focus on growing, not selling.'
        },
        {
            question: 'What can restaurants and grocers expect from FreshBridge?',
            answer: 'FreshBridge allows buyers to access real-time listings of fresh, locally sourced food. Orders are consolidated and delivered efficiently, with transparent pricing and direct communication with producers.'
        },
        {
            question: 'Is FreshBridge only for Ontario?',
            answer: 'Currently, our pilot is focused on the Greater Toronto Area, but we are expanding soon. You can still sign up now to be first in line as we grow.'
        },
        {
            question: 'How do payments and deliveries work?',
            answer: 'Buyers pay through the platform, and we handle secure payments to farmers. Logistics are coordinated with our delivery partners to ensure reliable fulfillment.'
        }
    ];
}
