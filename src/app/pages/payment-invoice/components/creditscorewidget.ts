import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { VerificationCodeModalComponent } from '@/components/verification-code-modal/verification-code-modal.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { GaugeChart } from '@/components/charts/gaugechart';
import { BankTransferService } from '@/service/banktransfer.service';
import { TransactionActionDialogComponent } from './transaction-action-dialog.component';
import { AuthService } from '@/auth/auth.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'credit-score-widget',
    standalone: true,
    imports: [CommonModule, FormsModule, DividerModule, ButtonModule, GaugeChart, TransactionActionDialogComponent, ProgressSpinnerModule, VerificationCodeModalComponent],
    providers: [MessageService],
    template: ` <div class="card xl:w-auto w-full !mb-0 min-w-80 !px-6 !pb-6 !pt-4 rounded-3xl border border-surface relative">
        <div *ngIf="loading" class="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-surface-950/60 z-10">
            <p-progressSpinner styleClass="w-full h-full" [style]="{ 'min-height': '200px' }" mode="indeterminate" />
        </div>
        <ng-container *ngIf="!loading">
        <div class="mb-2 flex items-start gap-2">
            <span class="flex-1 label-medium">Account Overview</span>
            <button><i class="pi pi-ellipsis-h text-surface-500 hover:text-surface-950 dark:hover:text-surface-0 transition-all"></i></button>
        </div>
        <gauge-chart [data]="data" [labels]="labels" />
        <div class="mt-8 rounded-lg border border-surface">
            <div class="border-b border-surface flex items-center justify-between px-3.5 py-2">
                <span class="label-small text-surface-950 dark:text-surface-0">Summary</span>
                <button><i class="pi pi-ellipsis-h text-surface-500 hover:text-surface-950 dark:hover:text-surface-0 transition-all"></i></button>
            </div>
            <div class="p-3.5 flex flex-col gap-3">
                <div class="flex items-center justify-between gap-4">
                    <span class="body-xsmall">Balance</span>
                    <span class="label-xsmall text-surface-950 dark:text-surface-0">{{ balance }}</span>
                </div>
                <p-divider class="!m-0" />
              
                <div class="flex items-center justify-between gap-4">
                    <span class="body-xsmall">Available </span>
                    <span class="px-2 py-1 rounded-lg text-green-700 bg-green-100 text-sm dark:text-surface-0">{{ availableBalance }}</span>
                </div>
            </div>
        </div>
        <!-- <p-button styleClass="mt-6 w-full !text-surface-950 dark:!text-surface-0 !rounded-lg" label="View account detail" outlined severity="secondary" /> -->
        <button pButton label="Add Transaction" class="mt-4 w-full" (click)="showDialog = true"></button>
        <transaction-action-dialog 
            [(visible)]="showDialog"
            (submitTransaction)="handleTransaction($event)">
        </transaction-action-dialog>
        <app-verification-code-modal
            [(visible)]="otpDialogVisible"
            title="Confirm with Authenticator"
            message="Enter the 6-digit code from your authenticator app."
            [loading]="otpLoading"
            [(code)]="otpCode"
            (verify)="confirmOtp()">
        </app-verification-code-modal>
        </ng-container>
    </div>`
})
export class CreditScoreWidget implements OnInit {
    accountId!: number;
    accountNumber!: string;
    availableBalance!: number;
    balance!: number;
    completedTransfers!: number;
    pendingTransfers!: number;
    totalTransferred!: number;
    totalTransfers!: number;
    name!: string;
    accountType!: string;

    data: number[] = [];
    labels: string[] = [];
    showDialog = false;
    loading = false;
    otpDialogVisible = false;
    otpCode = '';
    otpLoading = false;

    pendingTransaction: { type: string; amount: number; description: string } | null = null;

    @Output() transactionSubmitted = new EventEmitter<void>();

    constructor(
        private authService: AuthService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.initAccountInfo();
    }

    initAccountInfo() {
        this.loading = true;
        // Get the current user's ID
        const currentUser = this.authService.currentUserValue;
        if (!currentUser) {
            console.error('No user is currently logged in');
            this.loading = false;
            return;
        }

        // Use the current user's ID (11 in your case) instead of hardcoded value
        const userId = currentUser.id;

        this.authService.getAccountInfo(userId).subscribe({
            next: (response: any) => {
                // Extract account data from the response
                const data = response.account;
                // all balance type should be 0.00 tyoe not long, wanna under point two decimal places
                data.availableBalance = parseFloat(data.availableBalance).toFixed(2);
                data.balance = parseFloat(data.balance).toFixed(2);
                this.accountId = data.id;
                this.accountNumber = data.accountNumber;
                this.availableBalance = data.availableBalance || 0;
                this.balance = data.balance;
                this.completedTransfers = response.transactions ? response.transactions.length : 0;
                this.name = data.name;
                this.accountType = data.accountType;

                // Update chart data
                this.data = [this.balance];
                this.labels = ['Balance', 'Pending Transfers'];
                this.loading = false;
            },
            error: (err) => {
                console.error('Error fetching account info:', err);
                // Add fallback values in case of error
                this.balance = 0;
                this.availableBalance = 0;
                this.data = [0];
                this.labels = ['Balance', 'Pending Transfers'];
                this.loading = false;
            }
        });
    }

    handleTransaction(event: { type: string, amount: number, description: string }) {
        // Get the current user's ID
        const currentUser = this.authService.currentUserValue;
        if (!currentUser) {
            console.error('No user is currently logged in');
            return;
        }

        // Use the current user's ID instead of the stored accountId
        const userId = currentUser.id;

        if (!userId) {
            console.error('User ID is not available');
            return;
        }

        if (currentUser.twoFaEnabled) {
            this.pendingTransaction = event;
            this.otpDialogVisible = true;
            this.otpCode = '';
            return;
        }

        this.executeTransaction(userId, event);
    }

    confirmOtp() {
        const currentUser = this.authService.currentUserValue;
        if (!currentUser || !this.pendingTransaction) {
            return;
        }
        if (!this.otpCode) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please enter a code.'
            });
            return;
        }
        this.otpLoading = true;
        this.authService.validateTwoFa(currentUser.id, this.otpCode).subscribe({
            next: (response) => {
                this.otpLoading = false;
                if (!response.valid) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Invalid authentication code.'
                    });
                    return;
                }
                const transaction = this.pendingTransaction;
                this.otpDialogVisible = false;
                this.pendingTransaction = null;
                if (transaction) {
                    this.executeTransaction(currentUser.id, transaction);
                }
            },
            error: () => {
                this.otpLoading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to verify authentication code.'
                });
            }
        });
    }

    private executeTransaction(userId: number, event: { type: string; amount: number; description: string }) {
        const onSuccess = () => {
            this.initAccountInfo();
            this.transactionSubmitted.emit();
        };

        if (event.type === 'WITHDRAWAL') {
            this.authService.withdraw(userId, event.amount).subscribe({
                next: onSuccess,
                error: err => console.error('Withdrawal failed', err)
            });
        } else if (event.type === 'CREDIT') {
            this.authService.deposit(userId, event.amount).subscribe({
                next: onSuccess,
                error: err => console.error('Deposit failed', err)
            });
        } else if (event.type === 'REFUND') {
            this.authService.refund(userId, event.amount).subscribe({
                next: onSuccess,
                error: err => console.error('Refund failed', err)
            });
        }
    }
}
