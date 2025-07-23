// userlist.ts
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
import { FarmerService, Farmer } from '@/service/farmer.service';
import { HttpClientModule } from '@angular/common/http';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
    selector: 'app-farmer-list',
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
        ToggleSwitchModule
    ],
    templateUrl: './farmer-managment.component.html',
    providers: [MessageService, ConfirmationService, FarmerService]
})
export class FarmerList implements OnInit {
    farmers = signal<Farmer[]>([]);
    farmerDialog: boolean = false;
    farmer: Farmer = {} as Farmer;
    selectedFarmers: Farmer[] = [];
    submitted: boolean = false;
    loading = signal<boolean>(true);

    farmTypes = [
        { label: 'Organic', value: 'ORGANIC' },
        { label: 'Conventional', value: 'CONVENTIONAL' },
        { label: 'Hydroponic', value: 'HYDROPONIC' },
        { label: 'Other', value: 'OTHER' }
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
        { field: 'farmType', header: 'Farm Type' },
        { field: 'active', header: 'Active' }
    ];

    constructor(
        private farmerService: FarmerService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit() {
        this.loadFarmers();
    }

    loadFarmers() {
        this.loading.set(true);
        this.farmerService.getFarmers().subscribe({
            next: (data) => {
                this.farmers.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.message || 'Failed to load farmers',
                    life: 3000
                });
                this.loading.set(false);
            }
        });
    }

    openNew() {
        this.farmer = {} as Farmer;
        this.submitted = false;
        this.farmerDialog = true;
    }

    editFarmer(farmer: Farmer) {
        this.farmer = { ...farmer };
        this.farmerDialog = true;
    }

    deleteFarmer(farmer: Farmer) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete ${farmer.firstName} ${farmer.lastName}?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.farmerService.deleteFarmer(farmer.id).subscribe({
                    next: () => {
                        this.farmers.set(this.farmers().filter(f => f.id !== farmer.id));
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Farmer Deleted',
                            life: 3000
                        });
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to delete farmer',
                            life: 3000
                        });
                    }
                });
            }
        });
    }

    hideDialog() {
        this.farmerDialog = false;
        this.submitted = false;
    }

    saveFarmer() {
        this.submitted = true;

        if (this.farmer.firstName?.trim() && this.farmer.lastName?.trim()) {
            if (this.farmer.id) {
                // Update existing farmer
                this.farmerService.updateFarmer(this.farmer.id, this.farmer).subscribe({
                    next: (updatedFarmer) => {
                        const index = this.farmers().findIndex(f => f.id === updatedFarmer.id);
                        if (index !== -1) {
                            const updatedFarmers = [...this.farmers()];
                            updatedFarmers[index] = updatedFarmer;
                            this.farmers.set(updatedFarmers);
                        }
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Farmer Updated',
                            life: 3000
                        });
                        this.farmerDialog = false;
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to update farmer',
                            life: 3000
                        });
                    }
                });
            } else {
                // Create new farmer
                this.farmerService.createFarmer(this.farmer).subscribe({
                    next: (newFarmer) => {
                        this.farmers.set([...this.farmers(), newFarmer]);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Farmer Created',
                            life: 3000
                        });
                        this.farmerDialog = false;
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to create farmer',
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