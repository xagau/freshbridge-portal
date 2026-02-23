// merchant-managment.ts
import { Component, OnInit, signal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MerchantService, Merchant } from '@/service/merchant.service';
import { HttpClientModule } from '@angular/common/http';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { AuthService } from '@/auth/auth.service';
import { PhonePipe } from '@/pipes/phone.pipe';

@Component({
    selector: 'app-merchant-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        InputTextModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        ConfirmDialogModule,
        DropdownModule,
        CalendarModule,
        RadioButtonModule,
        TableModule,
        CheckboxModule,
        ProgressSpinnerModule,
        ToggleSwitchModule,
        InputIconModule,
        IconFieldModule,
        PhonePipe
    ],
    templateUrl: './merchant-managment.component.html',
    providers: [MessageService, ConfirmationService, MerchantService, AuthService]
})
export class MerchantList implements OnInit {
    merchants = signal<Merchant[]>([]);
    merchantDialog: boolean = false;
    merchant: Merchant = {} as Merchant;
    selectedMerchants: Merchant[] = [];
    submitted: boolean = false;
    loading = signal<boolean>(true);

    merchantTypes = [
        { label: 'Organic', value: 'ORGANIC' },
        { label: 'Conventional', value: 'CONVENTIONAL' },
        { label: 'Hydroponic', value: 'HYDROPONIC' },
        { label: 'Aquaponic', value: 'AQUAPONIC' }
    ];

    communicationPreferences = [
        { label: 'Email', value: 'EMAIL' },
        { label: 'SMS', value: 'SMS' },
        { label: 'Phone', value: 'PHONE' },
        { label: 'Mail', value: 'MAIL' }
    ];

    cols = [
        { field: 'id', header: 'ID' },
        { field: 'firstName', header: 'First Name' },
        { field: 'lastName', header: 'Last Name' },
        { field: 'email', header: 'Email' },
        { field: 'phoneNumber', header: 'Phone' },
        { field: 'merchantType', header: 'Merchant Type' },
        { field: 'active', header: 'Active' }
    ];

    constructor(
        private merchantService: MerchantService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.loadMerchants();
    }

    loadMerchants() {
        this.loading.set(true);
        this.merchantService.getMerchants().subscribe({
            next: (data) => {
                this.merchants.set(data);
                data.forEach(merchant => {
                    this.authService.getAccountInfo(merchant.userId).subscribe({
                        next: (response: any) => {
                            merchant.accountbalance = response?.account?.balance.toFixed(0) || 0;
                        },
                        error: (err) => {
                            merchant.accountbalance = NaN;
                        },
                        complete: () => {
                            console.log("complete: - loadMerchants");
                            this.loading.set(false);
                        }
                    });
                });
                // this.loading.set(false);
            },  
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.message || 'Failed to load merchants',
                    life: 3000
                });
                this.loading.set(false);
            }
        });
    }

    openNew() {
        this.merchant = {} as Merchant;
        this.submitted = false;
        this.merchantDialog = true;
    }

    editMerchant(merchant: Merchant) {
        this.merchant = { ...merchant };
        this.merchantDialog = true;
    }

    deleteMerchant(merchant: Merchant) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete ${merchant.firstName} ${merchant.lastName}?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.merchantService.deleteMerchant(merchant.id).subscribe({
                    next: () => {
                        this.merchants.set(this.merchants().filter(m => m.id !== merchant.id));
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Merchant Deleted',
                            life: 3000
                        });
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to delete merchant',
                            life: 3000
                        });
                    }
                });
            }
        });
    }

    hideDialog() {
        this.merchantDialog = false;
        this.submitted = false;
    }

    saveMerchant() {
        this.submitted = true;

        // Validate the merchant with mail regex
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;;
        if (!emailRegex.test(this.merchant.email)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please enter a valid email address',
                life: 3000
            });
            return;
        }
        if (this.merchant.firstName?.trim() && this.merchant.lastName?.trim()) {
            if (this.merchant.id) {
                // Update existing merchant
                this.merchantService.updateMerchant(this.merchant.id, this.merchant).subscribe({
                    next: (updatedMerchant) => {
                        const index = this.merchants().findIndex(m => m.id === updatedMerchant.id);
                        if (index !== -1) {
                            const updatedMerchants = [...this.merchants()];
                            updatedMerchants[index] = updatedMerchant;
                            this.merchants.set(updatedMerchants);
                        }
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Merchant Updated',
                            life: 3000
                        });
                        this.merchantDialog = false;
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to update merchant',
                            life: 3000
                        });
                    }
                });
            } else {
                // Create new merchant
                this.merchantService.createMerchant(this.merchant).subscribe({
                    next: (newMerchant) => {
                        this.merchants.set([...this.merchants(), newMerchant]);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Merchant Created',
                            life: 3000
                        });
                        this.merchantDialog = false;
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to create merchant',
                            life: 3000
                        });
                    }
                });
            }
        }
    }

    confirmDeleteSelected() {

    }
    getStatusSeverity(status: boolean) {
        return status ? 'success' : 'danger';
    }
}
