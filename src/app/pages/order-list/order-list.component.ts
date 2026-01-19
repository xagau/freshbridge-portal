import { Component, OnInit } from '@angular/core';
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
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  selectedStatus = 'ALL';
  statuses = [
    { label: 'All', value: 'ALL' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Accepted', value: 'ACCEPTED' },
    { label: 'Preparing', value: 'PREPARING' },
    { label: 'Ready for Pickup', value: 'READY_FOR_PICKUP' },
    { label: 'Delivering', value: 'DELIVERING' },
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
    role: "MERCHANT"
  };
  showShipmentDialog = false;
  constructor(
    private ordersSvc: OrdersService,
    public authService: AuthService,
    private toast: MessageService,
    private shipmentService: ShipmentService
  ) { }


  ngOnInit() {
    this.fetch();
  }

  handleScheduleSave(event: any) {
    // Handle the saved schedule data
    console.log('Schedule saved:', event);
    // Reload the table after saving schedule
    this.fetch();
  }

  handleScheduleCancel() {
    // Handle cancel if needed
    this.fetch();
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
    let params: any = {};
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser.userId = this.authService.getProfileId();
        this.currentUser.role = user?.role;
      }
      if (user?.role === 'BUYER' || user?.role === "MERCHANT") {
        params = {
          userId: this.currentUser.userId,
          status: this.selectedStatus !== 'ALL' ? this.selectedStatus : null
        };
      }
      else if (user?.role === 'COURIER') {
        params = {
          // userId: this.currentUser.userId,
          isCourier: true,
          status: this.selectedStatus !== 'ALL' ? this.selectedStatus : null
        };
      }
    })
    console.log("params", params)
    this.ordersSvc.listByRole(params).subscribe({
      next: (data) => {
        this.orders = data;
        console.log("data", data);

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
