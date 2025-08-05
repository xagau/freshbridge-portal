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
        <div class="flex items-center gap-2">
            <div class="flex-1 flex flex-col gap-1">
                <span class="label-medium">Transactions History</span>
                <span class="body-xsmall text-left">Track money coming in and going out from this area.</span>
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
    ngOnInit() {
        this.loadTransactionsFromAccountInfo();
    }

    private loadTransactionsFromAccountInfo() {
        const currentUser = this.authService.currentUserValue;
        if (!currentUser) {
            console.error('No user is currently logged in');
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

                if (response && response.transactions && Array.isArray(response.transactions)) {
                    // Store the account name for use in transformTransaction
                    const accountName = response.account?.name || currentUser?.name || 'Unknown';

                    // Use the transactions array from the response
                    this.transactions = response.transactions.map((t: Transaction) => {
                        // Add the account name to each transaction
                        return this.transformTransaction({ ...t, accountName: accountName });
                    });
                } else {
                    console.warn('No transactions found in account info response');
                    this.transactions = [];
                }
            },
            error: (err) => {
                console.error('Error fetching account info:', err);
                this.transactions = [];
            }
        });
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
            amount: `${t.type === 'CREDIT' ? '+' : '-'}${t.amount.toLocaleString()}`,
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
}
