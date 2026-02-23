// buyer-management.component.ts
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
import { BuyerService, Buyer } from '@/service/buyer.service';
import { HttpClientModule } from '@angular/common/http';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { AuthService } from '@/auth/auth.service';


@Component({
    selector: 'app-buyer-management',
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
        IconFieldModule
    ],
    templateUrl: './buyer-management.component.html',
    providers: [MessageService, ConfirmationService, BuyerService]
})
export class BuyerManagementComponent implements OnInit {
    buyers = signal<Buyer[]>([]);
    buyerDialog: boolean = false;
    buyer: Buyer = {} as Buyer;
    selectedBuyers: Buyer[] = [];
    submitted: boolean = false;
    loading = signal<boolean>(true);

    cols = [
        { field: 'id', header: 'ID' },
        { field: 'name', header: 'Name' },
        { field: 'email', header: 'Email' },
        { field: 'phoneNumber', header: 'Phone' },
        { field: 'address', header: 'Address' },
        { field: 'website', header: 'Website' },
        { field: 'active', header: 'Active' }
    ];

    constructor(
        private buyerService: BuyerService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.loadBuyers();
    }

    loadBuyers() {
        this.loading.set(true);
        this.buyerService.getBuyers().subscribe({
            next: (data) => {
                this.buyers.set(data);
                data.forEach(buyer => {
                    this.authService.getAccountInfo(buyer.userId).subscribe({
                        next: (response: any) => {
                            buyer.accountbalance = response?.account?.balance.toFixed(0) || 0;

                        },
                        error: (err) => {
                            buyer.accountbalance = NaN;
                        },
                        complete: () => {
                            console.log("complete: - loadBuyers");
                            
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
                    detail: err.message || 'Failed to load buyers',
                    life: 3000
                });
                this.loading.set(false);
            }
        });
    }

    openNew() {
        this.buyer = {} as Buyer;
        this.submitted = false;
        this.buyerDialog = true;
    }

    editBuyer(buyer: Buyer) {
        this.buyer = { ...buyer };
        this.buyerDialog = true;
    }

    deleteBuyer(buyer: Buyer) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete ${buyer.name}?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.buyerService.deleteBuyer(buyer.id).subscribe({
                    next: () => {
                        this.buyers.set(this.buyers().filter(b => b.id !== buyer.id));
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Buyer Deleted',
                            life: 3000
                        });
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to delete buyer',
                            life: 3000
                        });
                    }
                });
            }
        });
    }

    hideDialog() {
        this.buyerDialog = false;
        this.submitted = false;
    }

    saveBuyer() {
        this.submitted = true;
        console.log(this.buyer);
        
        const websiteRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        if (!websiteRegex.test(this.buyer.website)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please enter a valid website',
                life: 3000
            });
            return;
        }

        if (this.buyer.name?.trim()) {
            if (this.buyer.id) {
                // Update existing buyer
                this.buyerService.updateBuyer(this.buyer.id, this.buyer).subscribe({
                    next: (updatedBuyer) => {
                        const index = this.buyers().findIndex(b => b.id === updatedBuyer.id);
                        if (index !== -1) {
                            const updatedBuyers = [...this.buyers()];
                            updatedBuyers[index] = updatedBuyer;
                            this.buyers.set(updatedBuyers);
                        }
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Buyer Updated',
                            life: 3000
                        });
                        this.buyerDialog = false;
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to update buyer',
                            life: 3000
                        });
                    }
                });
            } else {
                // Create new buyer
                this.buyerService.createBuyer(this.buyer).subscribe({
                    next: (newBuyer) => {
                        this.buyers.set([...this.buyers(), newBuyer]);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Buyer Created',
                            life: 3000
                        });
                        this.buyerDialog = false;
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to create buyer',
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
