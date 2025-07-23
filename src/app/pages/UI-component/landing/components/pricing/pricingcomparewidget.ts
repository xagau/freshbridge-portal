import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-pricing-compare-widget',
    standalone: true,
    imports: [CommonModule],
    template: `
        <section class="landing-container mx-auto py-10 lg:py-20">
            <div class="max-w-lg md:max-w-4xl xl:max-w-full mx-auto p-7 border border-surface-200 dark:border-surface-800 rounded-3xl">
                <div
                    class="sticky top-24 text-surface-950 dark:text-surface-0 label-medium leading-normal hidden md:flex rounded-xl bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)]"
                >
                    <span class="flex-[1.15] px-6 py-3 text-left">Plan</span>
                    <div class="flex flex-[3]">
                        <span *ngFor="let data of plans; let index = index" class="flex-1 px-6 py-3 text-center capitalize">
                            {{ data }}
                        </span>
                    </div>
                </div>

                <div class="md:mt-7">
                    <div *ngFor="let data of planDetails; let index = index">
                        <div class="flex md:flex-row flex-col">
                            <div
                                class="md:!bg-transparent bg-surface-100 dark:bg-surface-900 border md:border-0 rounded-xl border-surface-200 dark:border-surface-800 flex-[1.15] px-6 py-4 text-left body-medium leading-normal text-surface-950 dark:text-surface-0"
                            >
                                {{ data.plan }}
                            </div>

                            <div class="flex md:flex-[3]">
                                <div *ngFor="let ingredient of data.ingredients; let j = index" class="flex-1 md:px-6 md:py-4 text-surface-950 dark:text-surface-0 text-center">
                                    <span class="md:hidden block flex-1 py-4 text-center capitalize body-medium leading-normal text-surface-950 dark:text-surface-0">
                                        {{ plans[j] }}
                                    </span>
                                    <div class="w-full h-[1px] bg-surface-200 dark:bg-surface-800 md:hidden block"></div>
                                    <div class="py-4 md:py-0">
                                        <i *ngIf="ingredient.includes('_yes')" class="pi pi-check text-center !text-sm text-surface-950 font-bold dark:text-surface-0"></i>
                                        <i *ngIf="ingredient.includes('_no')" class="pi pi-minus text-center !text-sm text-surface-500"></i>
                                        <span *ngIf="!ingredient.includes('_yes') && !ingredient.includes('_no')" class="text-surface-950 dark:text-surface-0 body-medium leading-normal">
                                            {{ ingredient }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div *ngIf="index !== planDetails.length - 1" class="w-full md:block hidden h-[1px] bg-surface-200 dark:bg-surface-800"></div>
                    </div>
                </div>
            </div>
        </section>
    `
})
export class PricingCompareWidget {
    plans = ['Community (Free)', 'Connected (Recommended)', 'Enterprise'];

    planDetails = [
        { plan: 'Pricing Model', ingredients: ['Farm Listed (0% fees)', 'Farm Listed (0% fees)', 'Farm Listed (0% fees)'] },
        { plan: 'Dynamic Pricing Engine', ingredients: ['_yes', '_yes', '_yes'] },
        { plan: 'Compliance & Food Safety', ingredients: ['_yes', '_yes', '_yes'] },
        { plan: 'Farm Direct Shipping', ingredients: ['_yes', '_yes', '_yes'] },
        { plan: 'FreshBridge-Managed Logistics', ingredients: ['_yes', '🚚 Priority Scheduling', 'SLA-Based Scheduling'] },
        { plan: 'Real-Time Inventory', ingredients: ['_yes', '_yes', 'Multi-location Sync'] },
        { plan: 'Invoice & Payment Integration', ingredients: ['_yes', '_yes', '_yes'] },
        { plan: 'FreshSelect™ AI Sourcing', ingredients: ['🟣 3-Month Trial', '_yes', 'Included w/ Custom Models'] },
        { plan: 'Analytics & Reporting', ingredients: ['🟣 3-Month Trial', '_yes', '_yes'] },
        { plan: 'Smart Reordering / Forecasting', ingredients: ['🟣 3-Month Trial', 'Predictive + Harvest', 'Custom Demand Planning API'] },
        { plan: 'Performance Dashboards', ingredients: ['🟣 3-Month Trial', 'Dynamic Dashboards', 'Multi-Site & ERP Integrated'] },
        { plan: 'Systems Integration Support', ingredients: ['🟣 3-Month Trial', '3 Integrations', '10+ Integrations (Custom/API)'] },
        { plan: 'Customer Success', ingredients: ['🧑‍💻 Self-Serve', 'Assigned Manager', 'Dedicated Team + Reviews'] },
        { plan: 'Private Supplier Network', ingredients: ['_no', '_no', 'Curated Access'] },
        { plan: 'Support', ingredients: ['📧 Email (48h)', '📞 Email/Phone (M–F, 9–5)', '🛠 24x7x365 SLA-Based'] },
        { plan: 'Subscription Cost', ingredients: ['$0', '$136/mo (3 users) or $289/mo (10 users)', 'Custom'] },
        { plan: 'Call to Action', ingredients: ['Subscribe Now', 'Subscribe Now', 'Contact Us'] }
    ];
}
