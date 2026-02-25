import { CommonModule } from '@angular/common';
import { Component, EventEmitter, NgZone, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
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
import { AutoComplete } from 'primeng/autocomplete';
import { AddressSearchResult, AddressService } from '@/service/address.service';
@Component({
    selector: 'app-schedule-repeat-order-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CalendarModule,
        CheckboxModule,
        DialogModule,
        DropdownModule,
        InputNumberModule,
        MultiSelectModule,
        RadioButtonModule,
        RippleModule,
        SelectButtonModule,
        ToggleButtonModule,
        AutoComplete,
        ToastModule
    ],
    template: `
        <p-toast></p-toast>
        <p-dialog 
            header="Schedule Recurring Order" 
            [(visible)]="visible" 
            [style]="{ width: '50vw' }" 
            [modal]="true"
            [draggable]="false" 
            [resizable]="false"
            (onHide)="onHide()">
            <div class="grid grid-cols-12 gap-4">
                <!-- 🚚 Delivery Address Section -->
                <div class="col-span-12">
                    <h3 class="text-xl font-medium mb-4">Delivery Address</h3>
                    <p-autocomplete
                        inputId="deliveryAddress"
                        [suggestions]="addressSuggestions"
                        (completeMethod)="searchAddress($event)"
                        (onSelect)="onAddressSelect($event)"
                        (ngModelChange)="onAddressInputChange($event)"
                        [(ngModel)]="addressQuery"
                        field="display_name"
                        [minLength]="3"
                        styleClass="w-full"
                        inputStyleClass="w-full"
                        [forceSelection]="false"
                    ></p-autocomplete>
                </div>

                <!-- 📅 Start Date Section -->
                <div class="col-span-12 md:col-span-6">
                    <h3 class="text-xl font-medium mb-4">Start Date</h3>
                    <p-calendar 
                        [(ngModel)]="startDate" 
                        [showIcon]="true" 
                        dateFormat="yy-mm-dd" 
                        [minDate]="minStartDate"
                        class="w-full">
                    </p-calendar>
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
                    <h3 class="text-xl font-medium mb-4">Repeat On</h3>
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
                                class="ml-4">
                            </p-calendar>
                        </div>
                        
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
                    <button pButton pRipple type="button" label="Save Recurring Order" class="p-button-primary" (click)="saveOrder()"></button>
                    <button pButton pRipple type="button" label="Cancel" class="p-button-outlined" (click)="onCancel()"></button>
                </div>
            </div>
        </p-dialog>
    `,
    providers: [MessageService, OrdersService, AuthService]
})
export class ScheduleRepeatOrderDialog {
    visible: boolean = false;
    authService = inject(AuthService);
    constructor(
        private ordersService: OrdersService,
        private messageService: MessageService,
        private addressService: AddressService,
        private zone: NgZone
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

    @Output() onSaveEvent = new EventEmitter<any>();
    @Output() onCancelEvent = new EventEmitter<void>();


    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    onHide() {
        this.onCancelEvent.emit();
    }
    // 🚚 Delivery Address
    deliveryAddress: string = '';
    addressQuery: string = '';
    addressSuggestions: AddressSearchResult[] = [];

    // Example IDs, replace with actual logic as needed
    // buyerId = 1;
    // merchantId = 1;

    userId = this.authService.currentUserValue?.id ?? 0;

    onAddressInputChange(value: string) {
        this.addressQuery = value || '';
        this.deliveryAddress = value || '';
    }

    onCancel() {
        this.onCancelEvent.emit();
        this.reset();
        this.hide();
    }

    async searchAddress(event: { query: string }) {
        const query = event?.query?.trim();
        if (!query) {
            this.addressSuggestions = [];
            return;
        }

        const results = await this.addressService.searchAddress(query, 5);
        this.zone.run(() => {
            this.addressSuggestions = results;
        });
    }

    onAddressSelect(event: { value?: AddressSearchResult }) {
        const selection = event?.value;
        if (!selection?.display_name) {
            return;
        }

        this.zone.run(() => {
            this.addressQuery = selection.display_name;
            this.deliveryAddress = selection.display_name;
            this.addressSuggestions = [];
        });
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

    saveOrder() {
        // validate the form 
        if(!this.deliveryAddress) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Delivery address is required',
                life: 3000
            });
            return;
        }
        if (!this.startDate || !this.selectedFrequency || !this.deliveryAddress) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill all required fields',
                life: 3000
            });
            return;
        }
        if (this.startDate < new Date()) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Start date cannot be in the past',
                life: 3000
            });
            return;
        }
        if (this.selectedFrequency.value === 'weekly' && !this.weekDays.some(day => day.selected)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please select at least one day',
                life: 3000
            });
            return;
        }
        if (this.endCondition === 'date' && !this.endDate) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'End date is required when "End by date" is selected',
                life: 3000
            });
            return;
        }
        if (this.endDate && this.endDate < this.startDate) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'End date must be after start date',
                life: 3000
            });
            return;
        }
        if (this.userId === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Unable to determine buyer or merchant ID',
                life: 3000
            });
            return;
        }
        const repeatOnDays = this.weekDays
            .filter(day => day.selected)
            .map(day => day.label.toUpperCase())
            .join(',');

        this.ordersService.createOrder({
            userId: this.userId,
            /* merchantId: this.merchantId,
            buyerId: this.buyerId,*/
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
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to create order',
                    life: 3000
                });
            }
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