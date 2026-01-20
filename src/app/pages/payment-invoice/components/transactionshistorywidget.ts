import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { UserInfoDialog } from '@/components/userinfo-dialogue/user-info-dialogue.component';
import { CustomerService, Customer } from '@/service/customer.service';
import { TransactionService, Transaction } from '@/service/transaction.service';
import { Dialog } from 'primeng/dialog';
import { TimelineModule } from 'primeng/timeline';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '@/auth/auth.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

enum TransactionStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED'
}

enum TransactionType {
    DEPOSIT = 'DEPOSIT',
    WITHDRAWAL = 'WITHDRAWAL',
    ORDER_PAYMENT = 'ORDER_PAYMENT',
    REFUND = 'REFUND',
    CREDIT = 'CREDIT',
    FEE = 'FEE',
    TRANSFER = 'TRANSFER'
}

@Component({
    selector: 'transactions-history-widget',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        TableModule,
        AvatarModule,
        UserInfoDialog,
        Dialog,
        TimelineModule,
        TagModule,
        DividerModule
    ],
    providers: [CustomerService],
    template: `
        <div class="flex items-center justify-between gap-2">
            <div class="flex-1 flex flex-col gap-1">
                <span class="label-medium">Transactions History</span>
                <span class="body-xsmall text-left">Track money coming in and going out from this area.</span>
            </div>
            <div class="flex items-center gap-2">
                <p-button 
                    icon="pi pi-file-pdf" 
                    label="PDF" 
                    severity="secondary" 
                    outlined 
                    size="small"
                    (onClick)="exportToPDF()"
                    [disabled]="transactions.length === 0">
                </p-button>
                <p-button 
                    icon="pi pi-file" 
                    label="CSV" 
                    severity="secondary" 
                    outlined 
                    size="small"
                    (onClick)="exportToCSV()"
                    [disabled]="transactions.length === 0">
                </p-button>
            </div>
        </div>
        <div class="w-full overflow-auto flex-1 mt-5">
            <p-table
                [value]="transactions"
                [rows]="7"
                [paginator]="true"
                [showCurrentPageReport]="true"
                currentPageReportTemplate="Showing page {currentPage} of {totalPages} pages"
                [(selection)]="selectedTransactions"
                dataKey="id"
                [tableStyle]="{ 'min-width': '50rem' }"
            >
                <ng-template #header>
                    <tr>
                        <th style="width: 4rem"><p-tableHeaderCheckbox /></th>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Account</th>
                        <th></th>
                    </tr>
                </ng-template>
                <ng-template #body let-data>
                    <tr [pSelectableRow]="data">
                        <td>
                            <p-tableCheckbox [value]="data" />
                        </td>
                        <td>
                            <div class="flex items-center cursor-pointer" (click)="showUserInfo(data.name.value)">
                                <p-avatar
                                    [label]="data.name.capName"
                                    styleClass="mr-2 !w-8 !h-8 !text-xs font-medium"
                                    [style]="{ backgroundColor: 'var(--p-' + data.name.bgColor + '-100)', color: 'var(--p-' + data.name.bgColor + '-950)' }"
                                    shape="circle"
                                />
                                <div class="label-xsmall text-surface-950 dark:text-surface-0">{{ data.name.value }}</div>
                            </div>
                        </td>
                        <td>
                            <div class="body-xsmall text-left">
                                {{ data.date }}
                            </div>
                        </td>
                        <td>
                            <div class="body-xsmall text-left" [style]="{ color: data.amount.startsWith('+') ? 'var(--p-green-500)' : 'var(--p-red-500)' }">
                                {{ data.amount }}
                            </div>
                        </td>
                        <td>
                            <div class="body-xsmall text-left">
                                {{ data.account }}
                            </div>
                        </td>
                        <td>
                            <div class="flex items-end justify-end">
                                <p-button icon="pi pi-eye" severity="info" (click)="viewTransaction(data)"></p-button>
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <p-dialog 
            [(visible)]="visible" 
            [modal]="true" 
            [closable]="true" 
            (onHide)="onClose()"  
            header="Transaction Details" 
            [style]="{ 'min-width': '40rem', 'max-width': '50rem' }"
        >
            <ng-container *ngIf="transaction">
                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <p class="text-sm text-gray-500">Transaction ID</p>
                        <p class="font-medium">{{ transaction.id }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Type</p>
                        <p-tag 
                            [value]="getTypeDisplay(transaction.type)" 
                            [severity]="getTypeSeverity(transaction.type)"
                            [styleClass]="'!text-xs'"
                        ></p-tag>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Amount</p>
                        <p class="font-medium" [style]="{ color: transaction.amount.startsWith('+') ? 'var(--green-500)' : 'var(--red-500)' }">
                            {{ transaction.amount }}
                        </p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Account</p>
                        <p class="font-medium">{{ transaction.account }}</p>
                    </div>
                </div>

                <p-divider />

                <div class="mt-6">
                    <p-timeline [value]="getStatusEvents(transaction)" layout="vertical" class="w-full" align="alternate">
                        <ng-template pTemplate="marker" let-event>
                            <span class="flex w-8 h-8 items-center justify-center text-white rounded-full z-10 shadow-sm" [style]="{ 'background-color': event.color }">
                                <i [class]="event.icon"></i>
                            </span>
                        </ng-template>
                        <ng-template pTemplate="content" let-event>
                            <div class="p-3">
                                <p class="font-semibold">{{ event.status }}</p>
                                <p class="text-sm text-gray-500">{{ event.date }}</p>
                                @if (event.note) {
                                    <p class="text-xs text-gray-400 mt-1">{{ event.note }}</p>
                                }
                            </div>
                        </ng-template>
                    </p-timeline>
                </div>

                <p-divider />

                <div class="mt-4">
                    <h3 class="font-medium mb-2">Details</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm text-gray-500">Sender/Recipient</p>
                            <p class="font-medium">{{ transaction.name.value }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Date</p>
                            <p class="font-medium">{{ transaction.date }}</p>
                        </div>
                    </div>
                    <div class="mt-4">
                        <p class="text-sm text-gray-500">Description</p>
                        <p class="font-medium">{{ transaction.description || 'No description provided' }}</p>
                    </div>
                </div>
            </ng-container>
        </p-dialog>

        <app-user-info-dialog 
            (onCloseEvent)="onUserDialogClose()"
            (onContactEvent)="onContactUser($event)">
        </app-user-info-dialog>
    `,
    host: {
        class: 'card xl:w-auto w-full xl:flex-1 !mb-0 flex-1 !px-7 !pb-7 !pt-6 border rounded-3xl border-surface flex flex-col justify-between overflow-hidden'
    },
    styles: `
        :host ::ng-deep {
            .p-datatable {
                .p-datatable-thead > tr th {
                    background: transparent;
                }

                .p-datatable-tbody > tr {
                    background: transparent;
                }

                .p-datatable-tbody > tr.p-datatable-row-selected > td,
                .p-datatable-tbody > tr:has(+ .p-datatable-row-selected) > td {
                    border-bottom-color: var(--p-datatable-body-cell-border-color);
                }

                .p-paginator {
                    background: transparent;
                }
            }
        }
    `
})

export class TransactionsHistoryWidget {
    @ViewChild(UserInfoDialog) userInfoDialog!: UserInfoDialog;
    selectedTransactions = null;

    constructor(
        private customerService: CustomerService,
        private transactionService: TransactionService,
        private authService: AuthService
    ) { }

    transactions: any[] = [];
    useDemoData: boolean = false; // Set to true to use demo data for testing

    ngOnInit() {
        if (this.useDemoData) {
            this.loadDemoTransactions();
        } else {
            this.loadTransactionsFromAccountInfo();
        }
    }

    private loadTransactionsFromAccountInfo() {
        const currentUser = this.authService.currentUserValue;
        if (!currentUser) {
            console.error('No user is currently logged in');
            // Fallback to demo data if no user is logged in
            this.loadDemoTransactions();
            return;
        }

        const userId = currentUser.id;

        this.authService.getAccountInfo(userId).subscribe({
            next: (response: any) => {
                // Based on the example response structure you provided:
                // {
                //   "account": { ... },
                //   "transactions": [ ... ]
                // }

                if (response && response.transactions && Array.isArray(response.transactions) && response.transactions.length > 0) {
                    // Store the account name for use in transformTransaction
                    const accountName = response.account?.name || currentUser?.name || 'Unknown';

                    // Use the transactions array from the response
                    this.transactions = response.transactions.map((t: Transaction) => {
                        // Add the account name to each transaction
                        return this.transformTransaction({ ...t, accountName: accountName });
                    });
                } else {
                    console.warn('No transactions found in account info response, loading demo data');
                    this.loadDemoTransactions();
                }
            },
            error: (err) => {
                console.error('Error fetching account info:', err);
                console.log('Loading demo data for testing');
                this.loadDemoTransactions();
            }
        });
    }

    private loadDemoTransactions() {
        const currentUser = this.authService.currentUserValue;
        const accountName = currentUser?.name || 'Demo User';
        const accountId = currentUser?.id || 1000;

        // Generate demo transactions with various types, statuses, and dates
        const now = new Date();
        const demoTransactions: any[] = [
            {
                id: 1,
                account: accountId,
                type: 'CREDIT',
                amount: 5000,
                status: 'COMPLETED',
                description: 'Initial account deposit',
                transactionDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                accountName: accountName
            },
            {
                id: 2,
                account: accountId,
                type: 'ORDER_PAYMENT',
                amount: 1250,
                status: 'COMPLETED',
                description: 'Payment for fresh produce order #ORD-2024-001',
                transactionDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
                createdAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
                accountName: accountName
            },
            {
                id: 3,
                account: accountId,
                type: 'TRANSFER',
                amount: 2000,
                status: 'COMPLETED',
                description: 'Transfer to partner account',
                transactionDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
                createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
                accountName: accountName
            },
            {
                id: 4,
                account: accountId,
                type: 'CREDIT',
                amount: 3500,
                status: 'COMPLETED',
                description: 'Payment received from buyer order',
                transactionDate: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
                createdAt: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
                accountName: accountName
            },
            {
                id: 5,
                account: accountId,
                type: 'FEE',
                amount: 25,
                status: 'COMPLETED',
                description: 'Platform service fee',
                transactionDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                accountName: accountName
            },
            {
                id: 6,
                account: accountId,
                type: 'WITHDRAWAL',
                amount: 1000,
                status: 'PENDING',
                description: 'Withdrawal request to bank account',
                transactionDate: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
                createdAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
                accountName: accountName
            },
            {
                id: 7,
                account: accountId,
                type: 'ORDER_PAYMENT',
                amount: 850,
                status: 'COMPLETED',
                description: 'Payment for organic vegetables order #ORD-2024-002',
                transactionDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                accountName: accountName
            },
            {
                id: 8,
                account: accountId,
                type: 'REFUND',
                amount: 450,
                status: 'COMPLETED',
                description: 'Refund for cancelled order #ORD-2024-003',
                transactionDate: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
                createdAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
                accountName: accountName
            },
            {
                id: 9,
                account: accountId,
                type: 'DEPOSIT',
                amount: 2000,
                status: 'COMPLETED',
                description: 'Direct deposit from payment processor',
                transactionDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                accountName: accountName
            },
            {
                id: 10,
                account: accountId,
                type: 'ORDER_PAYMENT',
                amount: 3200,
                status: 'FAILED',
                description: 'Payment failed for order #ORD-2024-004 - Insufficient funds',
                transactionDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                accountName: accountName,
                failureReason: 'Insufficient funds'
            },
            {
                id: 11,
                account: accountId,
                type: 'CREDIT',
                amount: 1800,
                status: 'COMPLETED',
                description: 'Payment received from bulk order',
                transactionDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                accountName: accountName
            },
            {
                id: 12,
                account: accountId,
                type: 'FEE',
                amount: 15,
                status: 'COMPLETED',
                description: 'Transaction processing fee',
                transactionDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                accountName: accountName
            },
            {
                id: 13,
                account: accountId,
                type: 'TRANSFER',
                amount: 500,
                status: 'PENDING',
                description: 'Transfer to supplier account',
                transactionDate: new Date(now.getTime() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
                createdAt: new Date(now.getTime() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(now.getTime() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
                accountName: accountName
            },
            {
                id: 14,
                account: accountId,
                type: 'ORDER_PAYMENT',
                amount: 950,
                status: 'COMPLETED',
                description: 'Payment for fresh fruits order #ORD-2024-005',
                transactionDate: new Date(now.getTime() - 0.25 * 24 * 60 * 60 * 1000).toISOString(),
                createdAt: new Date(now.getTime() - 0.25 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date(now.getTime() - 0.25 * 24 * 60 * 60 * 1000).toISOString(),
                accountName: accountName
            },
            {
                id: 15,
                account: accountId,
                type: 'CREDIT',
                amount: 2750,
                status: 'COMPLETED',
                description: 'Payment received from buyer chain order',
                transactionDate: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                accountName: accountName
            }
        ];

        // Transform demo transactions using the same method as real transactions
        this.transactions = demoTransactions.map((t: any) => this.transformTransaction(t));
    }

    private transformTransaction(t: any): any {
        // Use the account name passed from loadTransactionsFromAccountInfo
        // This comes from response.account.name in the API response
        let accountName = t.accountName || 'Unknown';
        let accountId = '0000';

        // Get the account ID from the transaction
        if (typeof t.account === 'number') {
            accountId = t.account.toString();
        }
        // Or it could be an object with id property
        else if (typeof t.account === 'object' && t.account !== null) {
            accountId = t.account.id?.toString() || '0000';
        }

        // Create initials for the avatar
        const capName: string = accountName.split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

        // Format the transaction date
        const dateStr = t.transactionDate || t.createdAt || new Date().toISOString();
        const formattedDate = new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        // Determine if amount should be positive (money coming in) or negative (money going out)
        const isPositive = ['CREDIT', 'REFUND', 'DEPOSIT'].includes(t.type);
        const amountSign = isPositive ? '+' : '-';

        return {
            id: t.id.toString(),
            name: {
                value: accountName,
                bgColor: this.getRandomColor(),
                capName: capName
            },
            date: formattedDate,
            type: t.type,
            status: t.status,
            description: t.description || 'No description provided',
            amount: `${amountSign}${t.amount.toLocaleString()}`,
            account: `**** **** ${accountId.padStart(4, '0').slice(-4)}`,
            // Store the original transaction for details view
            originalTransaction: t
        };
    }

    @Input() transaction: any;
    @Output() onCloseEvent = new EventEmitter<void>();
    visible = false;

    viewTransaction(transaction: any) {
        this.transaction = transaction;
        this.visible = true;
    }

    onClose() {
        this.visible = false;
        this.onCloseEvent.emit();
    }

    private getRandomColor(): string {
        const colors = ['lime', 'indigo', 'rose', 'violet', 'cyan', 'yellow', 'blue'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    showUserInfo(userName: string) {
        const customer = this.customerService.getCustomerByName(userName);
        if (customer) {
            this.userInfoDialog.show(customer);
        }
    }

    onUserDialogClose() {
        console.log('User dialog closed');
    }

    onContactUser(user: Customer) {
        console.log('Contact user:', user);
    }

    // New methods for transaction type and status handling
    getTypeDisplay(type: string): string {
        switch (type) {
            case TransactionType.DEPOSIT: return 'Deposit';
            case TransactionType.WITHDRAWAL: return 'Withdrawal';
            case TransactionType.ORDER_PAYMENT: return 'Order Payment';
            case TransactionType.REFUND: return 'Refund';
            case TransactionType.CREDIT: return 'Credit';
            case TransactionType.FEE: return 'Fee';
            case TransactionType.TRANSFER: return 'Transfer';
            default: return type;
        }
    }

    getTypeSeverity(type: string): string {
        switch (type) {
            case TransactionType.DEPOSIT:
            case TransactionType.CREDIT:
            case TransactionType.REFUND:
                return 'success';
            case TransactionType.WITHDRAWAL:
            case TransactionType.FEE:
                return 'danger';
            case TransactionType.ORDER_PAYMENT:
                return 'info';
            case TransactionType.TRANSFER:
                return 'warning';
            default:
                return 'info';
        }
    }

    getStatusEvents(transaction: any): any[] {
        const statusMap: Record<TransactionStatus, { display: string; icon: string; color: string; note?: string }> = {
            [TransactionStatus.PENDING]: {
                display: 'Pending',
                icon: 'pi pi-clock',
                color: '#FF9800',
                note: 'Transaction is being processed'
            },
            [TransactionStatus.COMPLETED]: {
                display: 'Completed',
                icon: 'pi pi-check-circle',
                color: '#4CAF50',
                note: 'Transaction was successful'
            },
            [TransactionStatus.FAILED]: {
                display: 'Failed',
                icon: 'pi pi-times-circle',
                color: '#F44336',
                note: transaction.failureReason || 'Transaction failed to process'
            },
            [TransactionStatus.CANCELLED]: {
                display: 'Cancelled',
                icon: 'pi pi-ban',
                color: '#607D8B',
                note: transaction.cancellationReason || 'Transaction was cancelled'
            },
            [TransactionStatus.REFUNDED]: {
                display: 'Refunded',
                icon: 'pi pi-replay',
                color: '#2196F3',
                note: transaction.refundReason || 'Amount was refunded'
            }
        };

        // Main flow statuses
        const mainFlowStatuses: TransactionStatus[] = [
            TransactionStatus.PENDING,
            TransactionStatus.COMPLETED
        ];

        // Error statuses
        const errorStatuses: TransactionStatus[] = [
            TransactionStatus.FAILED,
            TransactionStatus.CANCELLED,
            TransactionStatus.REFUNDED
        ];

        const currentStatus = transaction.status as TransactionStatus;
        const isErrorStatus = errorStatuses.includes(currentStatus);

        // Create events for main flow
        const events = mainFlowStatuses.map((status) => {
            const isActive = !isErrorStatus &&
                mainFlowStatuses.indexOf(status) <= mainFlowStatuses.indexOf(currentStatus);

            return {
                ...statusMap[status],
                status: statusMap[status].display,
                date: transaction.date,
                color: isActive ? statusMap[status].color : '#E0E0E0'
            };
        });

        // Add error status if applicable
        if (isErrorStatus) {
            events.push({
                ...statusMap[currentStatus],
                status: statusMap[currentStatus].display,
                date: transaction.updatedAt || transaction.date,
                color: statusMap[currentStatus].color
            });
        }

        return events;
    }

    reloadTransactions() {
        // Reload transactions using the account info API
        this.loadTransactionsFromAccountInfo();
    }

    exportToCSV() {
        if (this.transactions.length === 0) {
            return;
        }

        // Prepare CSV data
        const headers = ['Transaction ID', 'Name', 'Date', 'Type', 'Status', 'Amount', 'Account', 'Description'];
        const rows = this.transactions.map(t => [
            t.id,
            t.name.value,
            t.date,
            this.getTypeDisplay(t.type),
            t.status,
            t.amount,
            t.account,
            t.description || 'No description provided'
        ]);

        // Create CSV content
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        ].join('\n');

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    exportToPDF() {
        if (this.transactions.length === 0) {
            return;
        }

        // Create PDF in landscape orientation for better width
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });
        
        // Add title
        doc.setFontSize(18);
        doc.text('Transaction Accounting Report', 14, 22);
        
        // Add date
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`, 14, 30);
        
        // Prepare table data
        const tableData = this.transactions.map(t => [
            t.id,
            t.name.value,
            t.date,
            this.getTypeDisplay(t.type),
            t.status,
            t.amount,
            t.account,
            t.description || 'No description'
        ]);

        // Add table with adjusted column widths for landscape orientation
        autoTable(doc, {
            head: [['ID', 'Name', 'Date', 'Type', 'Status', 'Amount', 'Account', 'Description']],
            body: tableData,
            startY: 35,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [66, 139, 202], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            columnStyles: {
                0: { cellWidth: 10 },
                1: { cellWidth: 20 },
                2: { cellWidth: 30 },
                3: { cellWidth: 35 },
                4: { cellWidth: 30 },
                5: { cellWidth: 25 },
                6: { cellWidth: 40 },
                7: { cellWidth: 80 } // Wider description column for landscape
            },
            margin: { top: 35, left: 14, right: 14 },
            tableWidth: 'wrap'
        });

        // Add summary
        const totalTransactions = this.transactions.length;
        const totalAmount = this.transactions.reduce((sum, t) => {
            const amount = parseFloat(t.amount.replace(/[+,]/g, ''));
            return sum + amount;
        }, 0);
        
        const finalY = (doc as any).lastAutoTable?.finalY || 35;
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Total Transactions: ${totalTransactions}`, 14, finalY + 10);
        doc.text(`Total Amount: ${totalAmount >= 0 ? '+' : ''}${totalAmount.toLocaleString()}`, 14, finalY + 16);

        // Save PDF
        doc.save(`transactions_${new Date().toISOString().split('T')[0]}.pdf`);
    }
}
