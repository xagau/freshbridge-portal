import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrdersService } from '@/service/orders.service';
import { AuthService } from '@/auth/auth.service';
import { MessageService } from 'primeng/api';
import { Order } from '@/model/order.model';
import { OrderDetailComponent } from './details/order-detail.component';

// PrimeNG modules
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StatusColorPipe } from '@/shared/pipes/status-color.pipe';
import { ScheduleOrderButton } from '@/components/schedule-order/schedule-order-button';
import { ShipmentService } from '@/service/shipment.service';
import { ShipmentSelectDialogComponent } from './shipment-select-dialog/shipment-select-dialog.component';

@Component({
    selector: 'app-order-list',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.scss'],
    standalone: true,
    imports: [DropdownModule, OrderDetailComponent, ScheduleOrderButton, ShipmentSelectDialogComponent, TableModule, StatusColorPipe, ProgressBarModule, DialogModule, ButtonModule, TagModule, ToastModule, CardModule, FormsModule, CommonModule],
    providers: [MessageService, OrdersService, AuthService]
})
export class OrderListComponent implements OnInit, OnDestroy {
    orders: Order[] = [];
    selectedStatus = 'ALL';
    statuses = [
        { label: 'All', value: 'ALL' },
        { label: 'Pending', value: 'PENDING' },
        { label: 'Accepted', value: 'ACCEPTED' },
        { label: 'Preparing', value: 'PREPARING' },
        { label: 'Ready for Pickup', value: 'READY_FOR_PICKUP' },
        { label: 'Delivered', value: 'DELIVERED' },
        { label: 'Completed', value: 'COMPLETED' },
        { label: 'Cancelled', value: 'CANCELLED' }
    ];
    loading = true;

    // Modal
    showDetail = false;
    currentOrder?: Order;
    currentUser: any = {
        userId: 0,
        role: "FARMER"
    };
    showShipmentDialog = false;

    private destroy$ = new Subject<void>();

    constructor(
        private ordersSvc: OrdersService,
        public authService: AuthService,
        private toast: MessageService,
        private shipmentService: ShipmentService
    ) { }

    ngOnInit() {
        this.authService.currentUser$
          .pipe(takeUntil(this.destroy$))
          .subscribe(user => {
            if (user) {
              this.currentUser = { userId: user.id, role: user.role };
              console.log('✅ currentUser is now set:', this.currentUser); // log here
              this.fetch();
            } else {
              console.log('❌ No user found');
              this.orders = [];
              this.loading = false;
            }
          });
      }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    handleScheduleSave(event: any) {
        // Handle the saved schedule data
        console.log('Schedule saved:', event);
    }

    handleScheduleCancel() {
        // Handle cancel if needed
    }

    changeStatus(event: Event, order: any, status: string) {
        event.stopPropagation();
        this.ordersSvc.updateStatus(order.id, status).subscribe(() => this.fetch());
    }

    public markOrderPaid(event: Event, order: any): void {
        event.stopPropagation();
        this.ordersSvc.markPaid(order.id).subscribe(() => this.fetch());
    }

    pickupOrder(event: Event, order: Order) {
        event.stopPropagation();
        this.currentOrder = order;
        this.showShipmentDialog = true;
    }

    onShipmentSelected(shipment: any) {
        if (!this.currentOrder) return;

        this.shipmentService.addToShipment(shipment.id, this.currentOrder.id).subscribe({
            next: () => {
                this.toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Order added to shipment successfully!'
                });
                this.ordersSvc.updateStatus(this.currentOrder!.id, 'DELIVERING').subscribe(() => {
                    this.fetch();
                });
            },
            error: (error: Error) => {
                this.toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.message // Display the actual error message
                });
                console.error('Shipment error:', error);
            }
        });
    }

    fetch() {
        this.loading = true;

        if (!this.currentUser || !this.currentUser.userId) {
            this.orders = [];
            this.loading = false;
            return;
        }

        const params = {
            status: this.selectedStatus !== 'ALL' ? this.selectedStatus : null
        };

        this.ordersSvc.getOrdersByUser(this.currentUser.userId, params).pipe(takeUntil(this.destroy$)).subscribe({
            next: (data) => {
                console.log('Fetched orders for user:', data);
                this.orders = data;
                this.loading = false;
            },
            error: () => {
                this.toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load orders.' });
                this.loading = false;
            }
        });
    }

    openDetail(order: Order) {
        this.currentOrder = order;
        this.showDetail = true;
    }

    statusStyle(status: string) {
        return { background: `var(--${status.toLowerCase()})` };
    }
}
