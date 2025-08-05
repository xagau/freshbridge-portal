import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { OrdersService } from '@/service/orders.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '@/auth/auth.service';

@Component({
    selector: 'app-schedule-repeat-order',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CalendarModule,
        CheckboxModule,
        DropdownModule,
        HttpClientModule,
        InputNumberModule,
        MultiSelectModule,
        RadioButtonModule,
        RippleModule,
        SelectButtonModule,
        ToggleButtonModule,
        ToastModule
    ],
    template: `
        <p-toast></p-toast>
        <div class="card">
            <div class="grid grid-cols-12 gap-4">
                <!-- 🚚 Delivery Address Section -->
                <div class="col-span-12">
                    <h3 class="text-xl font-medium mb-4">Delivery Address <span class="text-red-500">*</span></h3>
                    <input 
                        type="text"
                        class="p-inputtext w-full"
                        placeholder="Start typing address..."
                        [(ngModel)]="deliveryAddress"
                        (input)="onAddressInput($event)"
                        autocomplete="off"
                        [class.p-invalid]="!deliveryAddress || deliveryAddress.trim().length < 10"
                    />
                    <small *ngIf="!deliveryAddress || deliveryAddress.trim().length < 10" class="p-error">
                        Address is required and must be at least 10 characters
                    </small>
                    <ul *ngIf="addressSuggestions.length" class="bg-white border mt-1 rounded shadow p-2 max-h-48 overflow-auto">
                        <li 
                            *ngFor="let suggestion of addressSuggestions" 
                            (click)="selectAddress(suggestion)"
                            class="cursor-pointer hover:bg-gray-100 p-2 rounded"
                        >
                            {{ suggestion }}
                        </li>
                    </ul>
                </div>

                <!-- 📅 Start Date Section -->
                <div class="col-span-12 md:col-span-6">
                    <h3 class="text-xl font-medium mb-4">Start Date <span class="text-red-500">*</span></h3>
                    <p-calendar 
                        [(ngModel)]="startDate" 
                        [showIcon]="true" 
                        dateFormat="yy-mm-dd" 
                        [minDate]="minStartDate"
                        class="w-full"
                        [class.p-invalid]="!startDate || startDate < getCurrentDate()">
                    </p-calendar>
                    <small *ngIf="!startDate || startDate < getCurrentDate()" class="p-error">
                        Start date is required and cannot be in the past
                    </small>
                </div>

                <!-- ⏱ Repeat Frequency Section -->
                <div class="col-span-12 md:col-span-6">
                    <h3 class="text-xl font-medium mb-4">Repeat Frequency</h3>
                    <p-selectButton 
                        [options]="frequencyOptions" 
                        [(ngModel)]="selectedFrequency" 
                        optionLabel="label"
                        class="w-full">
                    </p-selectButton>

                    <!-- Custom Frequency Input -->
                    <!-- <div *ngIf="selectedFrequency.value === 'custom'" class="mt-4">
                        <div class="flex items-center gap-4">
                            <span>Every</span>
                            <p-inputNumber [(ngModel)]="customFrequencyValue" [min]="1" [max]="30"></p-inputNumber>
                            <p-dropdown 
                                [(ngModel)]="customFrequencyUnit" 
                                [options]="customFrequencyUnits" 
                                optionLabel="label">
                            </p-dropdown>
                        </div>
                    </div> -->
                </div>

                <!-- 📆 Repeat On Days (for weekly) -->
                <div *ngIf="selectedFrequency.value === 'weekly'" class="col-span-12">
                    <h3 class="text-xl font-medium mb-4">Repeat On <span class="text-red-500">*</span></h3>
                    <div class="flex flex-wrap gap-2">
                        <p-toggleButton 
                            *ngFor="let day of weekDays" 
                            [onLabel]="day.label" 
                            [offLabel]="day.label"
                            [(ngModel)]="day.selected" 
                            styleClass="p-button-outlined"
                            [ngClass]="{ '!bg-primary text-white': day.selected }"
                            >
                        </p-toggleButton>
                    </div>
                    <small *ngIf="selectedFrequency.value === 'weekly' && !hasSelectedWeekDays()" class="p-error">
                        Please select at least one day for weekly orders
                    </small>
                </div>

                <!-- 🛑 End Conditions Section -->
                <div class="col-span-12">
                    <h3 class="text-xl font-medium mb-4">End Conditions</h3>
                    <div class="flex flex-col gap-4">
                        <div class="flex align-items-center">
                            <p-radioButton 
                                name="endCondition" 
                                value="never" 
                                [(ngModel)]="endCondition" 
                                inputId="endNever">
                            </p-radioButton>
                            <label for="endNever" class="ml-2">Never end</label>
                        </div>
                        
                        <div class="flex align-items-center">
                            <p-radioButton 
                                name="endCondition" 
                                value="date" 
                                [(ngModel)]="endCondition" 
                                inputId="endDate">
                            </p-radioButton>
                            <label for="endDate" class="ml-2">End by date:</label>
                            <p-calendar 
                                *ngIf="endCondition === 'date'"
                                [(ngModel)]="endDate" 
                                [showIcon]="true" 
                                dateFormat="yy-mm-dd" 
                                [minDate]="startDate"
                                class="ml-4"
                                [class.p-invalid]="endCondition === 'date' && (!endDate || endDate <= startDate)">
                            </p-calendar>
                        </div>
                        <small *ngIf="endCondition === 'date' && (!endDate || endDate <= startDate)" class="p-error ml-6">
                            End date is required and must be after start date
                        </small>
                        
                        <!-- <div class="flex align-items-center">
                            <p-radioButton 
                                name="endCondition" 
                                value="occurrences" 
                                [(ngModel)]="endCondition" 
                                inputId="endOccurrences">
                            </p-radioButton>
                            <label for="endOccurrences" class="ml-2">End after</label>
                            <p-inputNumber 
                                *ngIf="endCondition === 'occurrences'"
                                [(ngModel)]="occurrences" 
                                [min]="1" 
                                [max]="100"
                                class="ml-4">
                            </p-inputNumber>
                            <span *ngIf="endCondition === 'occurrences'" class="ml-2">occurrences</span>
                        </div> -->
                    </div>
                </div>

                <!-- ✅ Additional Options -->
                <!-- <div class="col-span-12">
                    <h3 class="text-xl font-medium mb-4">Additional Options</h3>
                    <div class="flex flex-col gap-4">
                        <div class="flex align-items-center">
                            <p-checkbox [(ngModel)]="skipHolidays" [binary]="true" inputId="skipHolidays"></p-checkbox>
                            <label for="skipHolidays" class="ml-2">Skip holidays</label>
                        </div>
                        
                        <div *ngIf="hasMultipleLocations" class="flex align-items-center">
                            <p-checkbox [(ngModel)]="applyToAllLocations" [binary]="true" inputId="applyToAll"></p-checkbox>
                            <label for="applyToAll" class="ml-2">Apply to all locations</label>
                        </div>
                        
                        <div class="flex align-items-center">
                            <p-inputSwitch [(ngModel)]="autoConfirmOrders"></p-inputSwitch>
                            <label for="autoConfirm" class="ml-2">Auto-confirm orders</label>
                        </div>
                    </div>
                </div> -->

                <!-- Summary Preview -->
                <div class="col-span-12">
                    <div class="border-round border-1 surface-border p-4">
                        <h3 class="text-xl font-medium mb-2">Order Summary</h3>
                        <p>
                            <strong>Schedule:</strong> {{ getScheduleSummary() }}
                        </p>
                    </div>
                </div>

                <!-- ✅ Save / Cancel Buttons -->
                <div class="col-span-12 flex justify-end gap-4 mt-4">
                    <button 
                        pButton 
                        pRipple 
                        type="button" 
                        [label]="isSubmitting ? 'Saving...' : 'Save Recurring Order'" 
                        class="p-button-primary" 
                        (click)="saveOrder()"
                        [disabled]="isSubmitting">
                    </button>
                    <button 
                        pButton 
                        pRipple 
                        type="button" 
                        label="Cancel" 
                        class="p-button-outlined"
                        [disabled]="isSubmitting">
                    </button>
                </div>
            </div>
        </div>
    `,
    providers: [MessageService, OrdersService, AuthService]
})
export class ScheduleRepeatOrder {

    constructor(
        private ordersService: OrdersService,
        private messageService: MessageService,
        private authService: AuthService,
        private http: HttpClient
    ) {
        this.startDate = new Date();
        this.minStartDate = new Date();
    }

    // 📅 Start Date
    startDate: Date = new Date();
    minStartDate: Date = new Date();

    // ⏱ Repeat Frequency
    frequencyOptions = [
        { label: 'One-time', value: 'once' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Biweekly', value: 'biweekly' },
        { label: 'Monthly', value: 'monthly' },
        // { label: 'Custom', value: 'custom' }
    ];
    selectedFrequency = this.frequencyOptions[0];

    // Custom Frequency
    customFrequencyValue = 2;
    customFrequencyUnits = [
        { label: 'days', value: 'days' },
        { label: 'weeks', value: 'weeks' },
        { label: 'months', value: 'months' }
    ];
    customFrequencyUnit = this.customFrequencyUnits[1];

    // 📆 Repeat On Days
    weekDays = [
        { label: 'Monday', value: 'mon', selected: false },
        { label: 'Tuesday', value: 'tue', selected: false },
        { label: 'Wednesday', value: 'wed', selected: false },
        { label: 'Thursday', value: 'thu', selected: false },
        { label: 'Friday', value: 'fri', selected: false },
        { label: 'Saturday', value: 'sat', selected: false },
        { label: 'Sunday', value: 'sun', selected: false }
    ];

    // 🛑 End Conditions
    endCondition = 'never';
    endDate: Date | null = null;
    occurrences = 5;

    // ✅ Additional Options
    skipHolidays = false;
    hasMultipleLocations = true;
    applyToAllLocations = false;
    autoConfirmOrders = true;

    // 🚚 Delivery Address
    deliveryAddress: string = '';
    addressSuggestions: string[] = [];

    // Example IDs, replace with actual logic as needed
    // restaurantId = 1;
    // farmerId = 1;
    userId = 1
    // Validation state
    isSubmitting = false;

    // Helper method for current date
    getCurrentDate(): Date {
        return new Date();
    }

    // Helper method to check if any week days are selected
    hasSelectedWeekDays(): boolean {
        return this.weekDays.filter(d => d.selected).length > 0;
    }


    onAddressInput(event: Event) {
        const input = event.target as HTMLInputElement;
        const query = input?.value ?? '';
        // Clear suggestions if query is too short
        if (!query) {
            this.addressSuggestions = [];
            return;
        }
        if (query.length < 3) {
            this.addressSuggestions = [];
            return;
        }
        // Example using Geoapify (free tier, replace YOUR_API_KEY)
        // this.http.get<any>(
        //     `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&filter=countrycode:ca&limit=5&apiKey=YOUR_API_KEY`
        // ).subscribe(res => {
        //     this.addressSuggestions = res.features.map((f: any) => f.properties.formatted);
        // });
    }

    selectAddress(address: string) {
        this.deliveryAddress = address;
        this.addressSuggestions = [];
    }

    getScheduleSummary(): string {
        return this.ordersService.getScheduleSummary({
            selectedFrequency: this.selectedFrequency,
            weekDays: this.weekDays,
            customFrequencyValue: this.customFrequencyValue,
            customFrequencyUnit: this.customFrequencyUnit,
            startDate: this.startDate,
            endCondition: this.endCondition,
            endDate: this.endDate,
            deliveryAddress: this.deliveryAddress
        });
    }

    // Validation methods
    validateDeliveryAddress(): boolean {
        console.log("this.deliveryAddress", this.deliveryAddress);
        if (!this.deliveryAddress || this.deliveryAddress.trim().length === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Delivery address is required',
                life: 3000
            });
            return false;
        }
        if (this.deliveryAddress.trim().length < 10) {
            this.messageService.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Delivery address must be at least 10 characters long',
                life: 3000
            });
            return false;
        }
        return true;
    }

    validateStartDate(): boolean {
        if (!this.startDate) {
            this.messageService.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Start date is required',
                life: 3000
            });
            return false;
        }

        const today = this.getCurrentDate();
        today.setHours(0, 0, 0, 0);

        if (this.startDate < today) {
            this.messageService.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Start date cannot be in the past',
                life: 3000
            });
            return false;
        }
        return true;
    }

    validateFrequency(): boolean {
        if (!this.selectedFrequency) {
            this.messageService.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Please select a frequency',
                life: 3000
            });
            return false;
        }
        return true;
    }

    validateWeeklyDays(): boolean {
        if (this.selectedFrequency.value === 'weekly') {
            if (!this.hasSelectedWeekDays()) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Validation Error',
                    detail: 'Please select at least one day for weekly orders',
                    life: 3000
                });
                return false;
            }
        }
        return true;
    }

    validateEndDate(): boolean {
        if (this.endCondition === 'date') {
            if (!this.endDate) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Validation Error',
                    detail: 'End date is required when "End by date" is selected',
                    life: 3000
                });
                return false;
            }

            if (this.endDate <= this.startDate) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Validation Error',
                    detail: 'End date must be after start date',
                    life: 3000
                });
                return false;
            }
        }
        return true;
    }

    validateUserRole(): boolean {
        let currentUser: any = null;
        this.authService.currentUser$.subscribe(user => {
            currentUser = user;
        });

        if (!currentUser) {
            this.messageService.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'User not authenticated',
                life: 3000
            });
            return false;
        }

        if (currentUser.role !== 'RESTAURANT' && currentUser.role !== 'FARMER') {
            this.messageService.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Only restaurants and farmers can create orders',
                life: 3000
            });
            return false;
        }
        return true;
    }

    validateAll(): boolean {
        return this.validateDeliveryAddress() &&
            this.validateStartDate() &&
            this.validateFrequency() &&
            this.validateWeeklyDays() &&
            this.validateEndDate() &&
            this.validateUserRole();
    }

    saveOrder() {
        // Prevent multiple submissions
        if (this.isSubmitting) {
            return;
        }

        // Run all validations first
        if (!this.validateAll()) {
            return;
        }

        this.isSubmitting = true;

        const repeatOnDays = this.weekDays
            .filter(day => day.selected)
            .map(day => day.label.toUpperCase())
            .join(',');

        // Get the current user and update IDs
        this.authService.currentUser$.subscribe(user => {
            console.log(user);

            /* if (user?.role === "RESTAURANT") {
                this.restaurantId = this.authService.getProfileId() || 0;
                console.log("restaurantId", this.authService.getProfileId())
            }
            else if (user?.role === "FARMER") {
                this.farmerId = this.authService.getProfileId() || 0;
                console.log("farmerId", this.authService.getProfileId())
            } */
            this.userId = this.authService.getProfileId() || 0;
            // console.log(this.farmerId)
            // console.log(this.restaurantId)
            // Validate IDs after getting them
            if (this.userId === 0) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Validation Error',
                    detail: 'Unable to determine restaurant or farmer ID',
                    life: 3000
                });
                this.isSubmitting = false;
                return;
            }

            // Proceed with order creation
            this.ordersService.createOrder({
                userId: this.userId,
                startDate: this.startDate.toISOString().slice(0, 10),
                frequency: this.selectedFrequency.value.toUpperCase(),
                repeatOnDays: repeatOnDays,
                deliveryAddress: this.deliveryAddress,
                openEnd: this.endCondition === 'never',
                endDate: this.endCondition === 'date' && this.endDate
                    ? this.endDate.toISOString().slice(0, 10)
                    : null
            }).subscribe({
                next: (order) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Order created successfully',
                        life: 3000
                    });
                    this.reset();
                    this.isSubmitting = false;
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to create order',
                        life: 3000
                    });
                    this.isSubmitting = false;
                }
            });
        });
    }

    reset() {
        this.startDate = new Date();
        this.minStartDate = new Date();
        this.selectedFrequency = this.frequencyOptions[0];
        this.customFrequencyValue = 2;
        this.customFrequencyUnit = this.customFrequencyUnits[1];
        this.weekDays.forEach(day => day.selected = false);
        this.endCondition = 'never';
        this.endDate = null;
        this.occurrences = 5;
        this.skipHolidays = false;
        this.applyToAllLocations = false;
        this.autoConfirmOrders = true;
        this.deliveryAddress = '';
        this.addressSuggestions = [];
    }
}