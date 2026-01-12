import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-terms-and-conditions',
    styleUrls: ['./terms-and-conditions.css'],
    imports: [CommonModule],
    template: `
        <div class="max-w-7xl mx-auto px-4 py-8 mt-24">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0 mb-2">Terms and Conditions</h1>
                <p class="text-surface-600 dark:text-surface-400">Last updated: {{ lastUpdated }}</p>
            </div>
            
            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Table of Contents - Left Side -->
                <aside class="lg:w-64 flex-shrink-0">
                    <div class="sticky top-24 p-6 bg-surface-100 dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700">
                        <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-0 mb-4">Table of Contents</h3>
                        <nav class="flex flex-col gap-2">
                            <a (click)="scrollToSection('section-1', $event)" class="table-of-contents-link">1. Acceptance of Terms</a>
                            <a (click)="scrollToSection('section-2', $event)" class="table-of-contents-link">2. Use License</a>
                            <a (click)="scrollToSection('section-3', $event)" class="table-of-contents-link">3. User Accounts</a>
                            <a (click)="scrollToSection('section-4', $event)" class="table-of-contents-link">4. Transactions</a>
                            <a (click)="scrollToSection('section-5', $event)" class="table-of-contents-link">5. Payment Terms</a>
                            <a (click)="scrollToSection('section-6', $event)" class="table-of-contents-link">6. Refund and Cancellation Policy</a>
                            <a (click)="scrollToSection('section-7', $event)" class="table-of-contents-link">7. Intellectual Property</a>
                            <a (click)="scrollToSection('section-8', $event)" class="table-of-contents-link">8. Limitation of Liability</a>
                            <a (click)="scrollToSection('section-9', $event)" class="table-of-contents-link">9. Privacy Policy</a>
                            <a (click)="scrollToSection('section-10', $event)" class="table-of-contents-link">10. Changes to Terms</a>
                            <a (click)="scrollToSection('section-11', $event)" class="table-of-contents-link">11. Contact Information</a>
                        </nav>
                    </div>
                </aside>
                
                <!-- Content - Right Side -->
                <div class="flex-1 card p-8">
                    <div class="prose prose-lg max-w-none dark:prose-invert">
                    <section id="section-1" class="mb-8 scroll-mt-20">
                        <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0 mb-4">1. Acceptance of Terms</h2>
                        <p class="text-surface-700 dark:text-surface-300 mb-4">
                            By accessing and using FreshBridge ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. 
                            If you do not agree to abide by the above, please do not use this service.
                        </p>
                    </section>

                    <section id="section-2" class="mb-8 scroll-mt-20">
                        <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0 mb-4">2. Use License</h2>
                        <p class="text-surface-700 dark:text-surface-300 mb-4">
                            Permission is granted to temporarily access the materials on FreshBridge's website for personal, non-commercial transitory viewing only. 
                            This is the grant of a license, not a transfer of title, and under this license you may not:
                        </p>
                        <ul class="list-disc pl-6 mb-4 text-surface-700 dark:text-surface-300 space-y-2">
                            <li>Modify or copy the materials</li>
                            <li>Use the materials for any commercial purpose or for any public display</li>
                            <li>Attempt to reverse engineer any software contained on FreshBridge's website</li>
                            <li>Remove any copyright or other proprietary notations from the materials</li>
                        </ul>
                    </section>

                    <section id="section-3" class="mb-8 scroll-mt-20">
                        <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0 mb-4">3. User Accounts</h2>
                        <p class="text-surface-700 dark:text-surface-300 mb-4">
                            When you create an account with us, you must provide information that is accurate, complete, and current at all times. 
                            You are responsible for safeguarding the password and for all activities that occur under your account.
                        </p>
                    </section>

                    <section id="section-4" class="mb-8 scroll-mt-20">
                        <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0 mb-4">4. Transactions</h2>
                        <p class="text-surface-700 dark:text-surface-300 mb-4">
                            All transactions made through FreshBridge are subject to verification and approval. We reserve the right to refuse or cancel any order 
                            for any reason, including but not limited to product availability, errors in pricing, or suspected fraudulent activity.
                        </p>
                    </section>

                    <section id="section-5" class="mb-8 scroll-mt-20">
                        <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0 mb-4">5. Payment Terms</h2>
                        <p class="text-surface-700 dark:text-surface-300 mb-4">
                            Payment must be made in full at the time of order placement unless otherwise agreed upon. We accept various payment methods as 
                            indicated on the Platform. All prices are in the currency specified and are subject to change without notice.
                        </p>
                    </section>

                    <section id="section-6" class="mb-8 scroll-mt-20">
                        <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0 mb-4">6. Refund and Cancellation Policy</h2>
                        <p class="text-surface-700 dark:text-surface-300 mb-4">
                            Refunds and cancellations are subject to our refund policy. Please review the specific terms applicable to your purchase. 
                            Refund requests must be submitted within the specified time frame and in accordance with our policy.
                        </p>
                    </section>

                    <section id="section-7" class="mb-8 scroll-mt-20">
                        <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0 mb-4">7. Intellectual Property</h2>
                        <p class="text-surface-700 dark:text-surface-300 mb-4">
                            The Platform and its original content, features, and functionality are and will remain the exclusive property of FreshBridge 
                            and its licensors. The Platform is protected by copyright, trademark, and other laws.
                        </p>
                    </section>

                    <section id="section-8" class="mb-8 scroll-mt-20">
                        <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0 mb-4">8. Limitation of Liability</h2>
                        <p class="text-surface-700 dark:text-surface-300 mb-4">
                            In no event shall FreshBridge, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, 
                            incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other 
                            intangible losses, resulting from your use of the Platform.
                        </p>
                    </section>

                    <section id="section-9" class="mb-8 scroll-mt-20">
                        <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0 mb-4">9. Privacy Policy</h2>
                        <p class="text-surface-700 dark:text-surface-300 mb-4">
                            Your use of the Platform is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices 
                            regarding the collection and use of your personal information.
                        </p>
                    </section>

                    <section id="section-10" class="mb-8 scroll-mt-20">
                        <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0 mb-4">10. Changes to Terms</h2>
                        <p class="text-surface-700 dark:text-surface-300 mb-4">
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will 
                            provide at least 30 days notice prior to any new terms taking effect.
                        </p>
                    </section>

                    <section id="section-11" class="mb-8 scroll-mt-20">
                        <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0 mb-4">11. Contact Information</h2>
                        <p class="text-surface-700 dark:text-surface-300 mb-4">
                            If you have any questions about these Terms and Conditions, please contact us at:
                        </p>
                        <p class="text-surface-700 dark:text-surface-300">
                            Email: support&#64;freshbridge.ca<br>
                            Website: <a href="/landing/contact" class="text-primary-600 hover:underline">Contact Us</a>
                        </p>
                    </section>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class TermsAndConditions implements OnInit {
    lastUpdated: string = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    ngOnInit(): void {
        // Enable smooth scrolling for anchor links
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    scrollToSection(sectionId: string, event: Event): void {
        event.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 80; // Offset for fixed header if any
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
}

