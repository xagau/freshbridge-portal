import { Component, signal, Input, OnInit, Output, EventEmitter, } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { DrawerModule } from 'primeng/drawer';
import { DividerModule } from 'primeng/divider';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ShipmentService } from '@/service/shipment.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TimelineModule } from 'primeng/timeline';
import { OrdersService } from '@/service/orders.service';
import { ChangeDetectorRef } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Order } from '@/model/order.model';

@Component({
    selector: 'app-shipment-view',
    standalone: true,
    imports: [
        DrawerModule,
        DividerModule,
        SelectModule,
        InputTextModule,
        FormsModule,
        ButtonModule,
        CommonModule,
        ProgressSpinnerModule,
        TimelineModule,
    ],
    providers: [OrdersService],
    template: ` 
    <p-drawer header="Shipment Details" [(visible)]="visible" position="right" styleClass="layout-rightmenu !w-full sm:!w-[36rem]" (onHide)="onDrawerHide()">
        @if (loading) {
            <div class="flex items-center justify-center h-full">
                <p-progressSpinner></p-progressSpinner>
            </div>
        } @else if (shipment()) {
            <div>
                
                <div class="grid grid-cols-2 gap-4 mt-4">
                    
                    <div>
                        <p class="text-sm text-gray-500">Tracking Number</p>
                        <p class="font-medium">{{ shipment().trackingNumber || 'N/A' }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Order Date</p>
                        <p class="font-medium">{{ shipment().estimatedDelivery | date:'mediumDate' }}</p>
                    </div>
                </div>

                <div class="mt-6">
                    <p-timeline [value]="getEvents(shipment())" layout="vertical" class="w-full" align="alternate">
                        <ng-template pTemplate="marker" let-event>
                            <span class="flex w-8 h-8 items-center justify-center text-white rounded-full z-10 shadow-sm" [style]="{ 'background-color': event.color }">
                                <i [class]="event.icon"></i>
                            </span>
                        </ng-template>
                        <ng-template pTemplate="content" let-event>
                            <div class="p-3">
                                <p class="font-semibold">{{ event.status }}</p>
                                <!-- <p class="text-sm text-gray-500">{{ event.date }}</p> -->
                                <p class="text-sm text-gray-500">----------------------</p>
                                @if (event.note) {
                                    <p class="text-xs text-gray-400 mt-1">{{ event.note }}</p>
                                }
                            </div>
                        </ng-template>
                    </p-timeline>
                </div>

                <p-divider class="!my-6" />

                <h2 class="title-h7 text-left">Items in Shipment</h2>
                @if (shipmentItems().length > 0) {
                    <div class="mt-4">
                        <div class="overflow-auto">
                            <table class="w-full">
                                <thead>
                                    <tr class="border-b border-gray-200">
                                        <th class="text-left py-2 px-4">Product</th>
                                        <th class="text-left py-2 px-4">Quantity</th>
                                        <th class="text-left py-2 px-4">subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @for (item of shipmentItems(); track item.id) {
                                        
                                        <tr class="border-b border-gray-200">
                                            <td class="py-2 px-4">{{ item.productName || 'Unknown Product' }}</td>
                                            <td class="py-2 px-4">{{ item.quantity }}</td>
                                            <td class="py-2 px-4">{{ item.subtotal | currency }}</td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                } @else {
                    <p class="text-gray-500 mt-4">No items found in this shipment.</p>
                }
            </div>
        } @else {
            <p class="text-gray-500">No shipment data available.</p>
        }
    </p-drawer>
    `,
    styles: `
        .custom-marker {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
        }
    `
})
export class AppShipmentView implements OnInit {
    @Input() visible: boolean = false;
    @Input() set shipmentData(value: any) {
        if (value) {
            this.loadShipmentDetails(value);
        }
    }

    ngOnInit() {
        if (this.visible && this.shipmentData)
            this.loadShipmentDetails(this.shipmentData);
    }

    @Output() visibleChange = new EventEmitter<boolean>();
    shipment = signal<any>(null);
    shipmentItems = signal<any[]>([]);
    loading = false;

    constructor(private cdRef: ChangeDetectorRef,
        private shipmentService: ShipmentService,
        private ordersService: OrdersService
    ) { }

    @Output() closed = new EventEmitter<void>();

    onDrawerHide() {
        this.visible = false;
        this.visibleChange.emit(false);
        this.closed.emit();
    }

    async loadShipmentDetails(shipment: any) {
        this.loading = true;
        this.shipment.set(null);
        this.shipmentItems.set([]);
        this.cdRef.detectChanges();

        try {
            // Set basic shipment data first
            this.shipment.set({
                ...shipment,
                orderId: shipment.farmerOrder?.id || shipment.orderId,
                estimatedDelivery: shipment.estimatedDeliveryDate || shipment.estimatedDelivery
            });
            console.log(shipment.orderId);
            
            // Convert Observable to Promise and await it, that is [] or error, set [] and then set text "No items found in this shipment." and then set loading to false
            const items = await lastValueFrom(this.ordersService.getOrderById(shipment.orderId)).then(items => items as Order).catch(() => []);
            this.shipmentItems.set((items as Order)?.items || []);
            console.log("shipmentItems", this.shipmentItems());
            this.loading = false;
            this.cdRef.detectChanges();
            this.visible = true;
        } catch (error) {
            this.shipmentItems.set([]);
            this.loading = false;
            this.cdRef.detectChanges();
        }
    }

    getEvents(shipment: any) {
        type StatusKey = 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY_FOR_PICKUP' | 'PICKED_UP' | 'DELIVERING' | 'DELIVERED' | 'DELIVERY_FAILED' | 'RETURNED' | 'CANCELLED';

        const statusMap: Record<StatusKey, { display: string; icon: string; color: string; note?: string }> = {
            'PENDING': {
                display: 'Pending',
                icon: 'pi pi-clock',
                color: '#9C27B0'
            },
            'ACCEPTED': {
                display: 'Accepted',
                icon: 'pi pi-check-circle',
                color: '#673AB7'
            },
            'PREPARING': {
                display: 'Preparing',
                icon: 'pi pi-cog',
                color: '#673AB7'
            },
            "READY_FOR_PICKUP": {
                display: 'Ready for Pickup',
                icon: 'pi pi-shopping-bag',
                color: '#3F51B5'
            },
            'PICKED_UP': {
                display: 'Picked Up',
                icon: 'pi pi-shopping-bag',
                color: '#3F51B5'
            },
            'DELIVERING': {
                display: 'Delivering',
                icon: 'pi pi-truck',
                color: '#FF9800'
            },
            'DELIVERED': {
                display: 'Delivered',
                icon: 'pi pi-check-circle',
                color: '#4CAF50'
            },
            'DELIVERY_FAILED': {
                display: 'Delivery Failed',
                icon: 'pi pi-exclamation-triangle',
                color: '#F44336',
                note: shipment.failureReason || 'Delivery attempt was unsuccessful'
            },
            'RETURNED': {
                display: 'Returned',
                icon: 'pi pi-undo',
                color: '#795548',
                note: shipment.returnReason || 'Shipment was returned'
            },
            'CANCELLED': {
                display: 'Cancelled',
                icon: 'pi pi-times-circle',
                color: '#F44336',
                note: shipment.cancellationReason || 'Shipment was cancelled'
            }
        };

        const statusOrder: StatusKey[] = [
            'PENDING',
            'ACCEPTED',
            'PREPARING',
            'READY_FOR_PICKUP',
            'PICKED_UP',
            'DELIVERING',
            'DELIVERED'
        ];

        // Special handling for failed/returned/cancelled statuses
        const errorStatuses: StatusKey[] = ['DELIVERY_FAILED', 'RETURNED', 'CANCELLED'];

        const currentStatus = shipment.status as StatusKey;
        const isCancelled = currentStatus === 'CANCELLED';
        
        // If cancelled, all icons should be grey, otherwise use normal logic
        const currentIndex = isCancelled 
            ? -1 // Set to -1 so all icons are grey
            : (statusOrder.includes(currentStatus)
                ? statusOrder.indexOf(currentStatus)
                : statusOrder.length - 1); // If not in main flow, show all main steps

        // Create timeline events for the main flow
        // If cancelled, all icons are grey (#E0E0E0), otherwise use normal color logic
        const events: Array<{ status: string; icon: string; color: string; date: string; note?: string }> = statusOrder.map((status, index) => ({
            status: statusMap[status]?.display || status,
            icon: statusMap[status]?.icon || 'pi pi-info-circle',
            color: isCancelled ? '#E0E0E0' : (index <= currentIndex ? (statusMap[status]?.color || '#4CAF50') : '#E0E0E0'),
            date: shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery).toLocaleString('en-US', { timeZone: 'GMT-0' }) : 'N/A'
        }));

        // Add error status if applicable (DELIVERY_FAILED, RETURNED, or CANCELLED)
        if (currentStatus === 'DELIVERY_FAILED' || currentStatus === 'RETURNED' || currentStatus === 'CANCELLED') {
            events.push({
                status: statusMap[currentStatus].display,
                icon: statusMap[currentStatus].icon,
                // If cancelled, use red color (#F44336), otherwise use the status color
                color: isCancelled ? '#F44336' : statusMap[currentStatus].color,
                date: shipment.updatedAt ? new Date(shipment.updatedAt).toLocaleString('en-US', { timeZone: 'GMT-0' }) : 'N/A',
                note: statusMap[currentStatus].note
            });
        }

        return events;
    }
}