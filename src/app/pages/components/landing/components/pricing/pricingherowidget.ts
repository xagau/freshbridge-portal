import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-pricing-hero-widget',
    standalone: true,
    imports: [CommonModule],
    template: `
        <section class="animate-fadein animate-duration-300 animate-ease-in landing-container mx-auto relative lg:pb-14 lg:pt-52 pt-36 pb-10">
            <h1 class="title-h4 lg:title-h1">
                Comprehensive<br />
                <span class="text-primary-600">Pricing and Fee Structures</span>
            </h1>
            <p class="body-small lg:body-medium mt-4 lg:mt-6 max-w-xs sm:max-w-lg lg:max-w-xl mx-auto">Our comprehensive pricing and fee structures offer a detailed breakdown of costs, ensuring transparency and clarity for our customers.</p>

            <div class="mb-14 mt-12 lg:mt-14 flex items-center gap-6 justify-center">
                <div (click)="isYearly = false" class="cursor-pointer text-surface-900 dark:text-surface-0 text-xl">Monthly</div>
                <button (click)="isYearly = !isYearly" class="w-[4.5rem] h-9 rounded-full relative bg-surface-100 hover:bg-surface-50 dark:bg-surface-900 dark:hover:bg-surface-800 border border-surface-200 dark:border-surface-800 transition-all">
                    <span class="w-7 h-7 rounded-full bg-primary-500 absolute top-[0.2rem] transition-all ease-in-out duration-200" [ngClass]="isYearly ? 'left-[calc(100%-2rem)]' : ' left-1'"></span>
                </button>
                <div (click)="isYearly = true" class="cursor-pointer text-surface-900 dark:text-surface-0 text-xl">Yearly</div>
            </div>

            <div class="flex flex-wrap gap-7 mx-auto max-w-lg md:max-w-4xl xl:max-w-full">
                <div *ngFor="let data of pricingData" class="w-full min-w-full sm:min-w-[25rem] flex-1 p-6 border border-surface-200 dark:border-surface-800 rounded-3xl shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)]">
                    <div class="w-fit py-1 px-4 rounded-full bg-surface-200 dark:bg-surface-800 font-medium uppercase text-surface-950 dark:text-surface-0">
                        {{ data.type }}
                    </div>
                    <div class="mt-9">
                        <span class="title-h2 mr-3">{{ data.price[isYearly ? 'yearly' : 'monthly'] }}</span>
                        <span class="title-h7">/ {{ isYearly ? 'Yearly' : 'Monthly' }}</span>
                    </div>
                    <p class="mt-7 body-medium text-left">
                        {{ data.description }}
                    </p>
                    <button class="mt-8 w-full py-3 rounded-xl bg-primary-500 hover:bg-primary-400 text-surface-0 transition-all">Get Started</button>
                    <div class="w-full h-[1px] bg-surface-200 dark:bg-surface-800 my-8"></div>
                    <div class="flex flex-col gap-3">
                        <div *ngFor="let content of data.ingredients" class="flex items-center gap-3">
                            <i class="pi pi-check text-surface-950 dark:text-surface-0 leading-none"></i>
                            <span class="flex-1 body-medium text-left text-surface-950 dark:text-surface-0">{{ content }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `
})
export class PricingHeroWidget {
    isYearly = false;

    pricingData = [
        {
            type: 'community',
            price: {
                yearly: '$0',
                monthly: '$0'
            },
            description: 'A great starting point for smaller merchants looking to connect with buyers and access essential tools.',
            ingredients: [
                'Dynamic Pricing Engine',
                'Compliance & Food Safety',
                'Merchant Direct Shipping',
                'FreshBridge-Managed Logistics',
                'Real-Time Inventory',
                'Invoice & Payment Integration',
                'FreshSelect™ AI Sourcing (3-Month Trial)',
                'Analytics & Reporting (3-Month Trial)',
                'Smart Reordering / Forecasting (3-Month Trial)',
                'Performance Dashboards (3-Month Trial)',
                'Systems Integration Support (3-Month Trial)',
                'Self-Serve Customer Success',
                'Email Support (48h Response Time)'
            ]
        },
        {
            type: 'connected',
            price: {
                yearly: '$1200',
                monthly: '$136'
            },
            description: 'Ideal for growing merchants ready to scale with integrated tools, predictive insights, and dedicated support.',
            ingredients: [
                'Dynamic Pricing Engine',
                'Compliance & Food Safety',
                'Merchant Direct Shipping',
                'Priority Logistics Scheduling',
                'Real-Time Inventory',
                'Invoice & Payment Integration',
                'FreshSelect™ AI Sourcing',
                'Predictive Smart Reordering + Harvest Forecasting',
                'Dynamic Performance Dashboards',
                '3 Systems Integrations',
                'Assigned Customer Success Manager',
                'Email & Phone Support (M–F, 9–5)'
            ]
        },
        {
            type: 'enterprise',
            price: {
                yearly: 'Custom',
                monthly: 'Custom'
            },
            description: 'Built for large, multi-site merchants who demand full customization, SLAs, and 24/7 support.',
            ingredients: [
                'Dynamic Pricing Engine',
                'Compliance & Food Safety',
                'Merchant Direct Shipping',
                'SLA-Based Logistics Scheduling',
                'Multi-location Inventory Sync',
                'Invoice & Payment Integration',
                'FreshSelect™ AI Sourcing w/ Custom Models',
                'Custom Demand Planning API',
                'ERP-Integrated Multi-Site Dashboards',
                '10+ Systems Integrations (Custom/API)',
                'Dedicated Customer Success Team + Reviews',
                'Curated Private Supplier Network',
                '24x7x365 SLA-Based Support'
            ]
        }
    ];
}
