import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-terms-and-conditions',
    imports: [CommonModule],
    template: `
        <div class="max-w-4xl mx-auto px-4 py-8 mt-24">
            <div class="card p-8">
                <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0 mb-2">Terms and Conditions</h1>
                <p class="text-surface-600 dark:text-surface-400 mb-8">Last updated: {{ lastUpdated }}</p>
                
                <div class="prose prose-lg max-w-none dark:prose-invert">
                    <section class="mb-8">
                        <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0 mb-4">1. Acceptance of Terms</h2>
                        <p class="text-surface-700 dark:text-surface-300 mb-4">
                            By accessing and using FreshBridge ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. 
                            If you do not agree to abide by the above, please do not use this service.
                        </p>
                    </section>

                    <section class="mb-8">
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

                    <section class="mb-8">
                        <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0 mb-4">3. User Accounts</h2>
                        <p class="text-surface-700 dark:text-surface-300 mb-4">
                            When you create an account with us, you must provide information that is accurate, complete, and current at all times. 
                            You are responsible for safeguarding the password and for all activities that occur under your account.
                        </p>
                    </section>

                    <section class="mb-8">
                        <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0 mb-4">4. Transactions</h2>
                        <p class="text-surface-700 dark:text-surface-300 mb-4">
                            All transactions made through FreshBridge are subject to verification and approval. We reserve the right to refuse or cancel any order 
                            for any reason, including but not limited to product availability, errors in pricing, or suspected fraudulent activity.
                        </p>
                    </section>

                    <section class="mb-8">
                        <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0 mb-4">5. Payment Terms</h2>
                        <p class="text-surface-700 dark:text-surface-300 mb-4">
                            Payment must be made in full at the time of order placement unless otherwise agreed upon. We accept various payment methods as 
                            indicated on the Platform. All prices are in the currency specified and are subject to change without notice.
                        </p>
                    </section>

                    <section class="mb-8">
                        <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0 mb-4">6. Refund and Cancellation Policy</h2>
                        <p class="text-surface-700 dark:text-surface-300 mb-4">
                            Refunds and cancellations are subject to our refund policy. Please review the specific terms applicable to your purchase. 
                            Refund requests must be submitted within the specified time frame and in accordance with our policy.
                        </p>
                    </section>

                    <section class="mb-8">
                        <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0 mb-4">7. Intellectual Property</h2>
                        <p class="text-surface-700 dark:text-surface-300 mb-4">
                            The Platform and its original content, features, and functionality are and will remain the exclusive property of FreshBridge 
                            and its licensors. The Platform is protected by copyright, trademark, and other laws.
                        </p>
                    </section>

                    <section class="mb-8">
                        <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0 mb-4">8. Limitation of Liability</h2>
                        <p class="text-surface-700 dark:text-surface-300 mb-4">
                            In no event shall FreshBridge, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, 
                            incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other 
                            intangible losses, resulting from your use of the Platform.
                        </p>
                    </section>

                    <section class="mb-8">
                        <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0 mb-4">9. Privacy Policy</h2>
                        <p class="text-surface-700 dark:text-surface-300 mb-4">
                            Your use of the Platform is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices 
                            regarding the collection and use of your personal information.
                        </p>
                    </section>

                    <section class="mb-8">
                        <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0 mb-4">10. Changes to Terms</h2>
                        <p class="text-surface-700 dark:text-surface-300 mb-4">
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will 
                            provide at least 30 days notice prior to any new terms taking effect.
                        </p>
                    </section>

                    <section class="mb-8">
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
    `
})
export class TermsAndConditions {
    lastUpdated: string = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

