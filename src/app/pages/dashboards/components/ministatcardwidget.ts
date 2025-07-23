import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
// import { OrdersWidget } from './orderswidget';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


import { OrdersService } from '@/service/orders.service';
import { ShipmentService } from '@/service/shipment.service';
import { ProductService } from '@/service/product.service';
import { LayoutService } from '@/layout/service/layout.service';
import { AppShipmentView } from '@/layout/components/app.shipmentView';
import { AuthService } from '@/auth/auth.service';
@Component({
    selector: 'mini-stat-card-widget',
    standalone: true,
    imports: [DropdownModule, AppShipmentView, CommonModule, FormsModule, SelectModule, TableModule, TimelineModule, ButtonModule, ChartModule, CardModule, ProgressSpinnerModule],
    templateUrl: './ministatcardwidget.component.html',
    host: {
        class: 'flex w-full flex-wrap gap-7'
    },
    providers: [AppShipmentView],
    styles: `
     :host ::ng-deep {
        .p-timeline-event-content,
        .p-timeline-event-opposite {
            display: none !important;
        }
        .p-timeline-event {
            min-height: 10px !important;
            height: 10px !important;
        }
        .custom-marker {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
        }
        .p-timeline-horizontal .p-timeline-event-connector {
            width: 0 !important;
        }
        .p-card {
            height: 100% !important;
            width: 100% !important;
        }
        .revenue-card p-chart > div {
            height: 100% !important;
            canvas {
                height: 100% !important;
            }
        }
        .p-card-body,.p-card-content {
            height: 100% !important;
        }
    }
    `
})
export class MiniStatCardWidget implements OnInit {
    loading = {
        shipments: false,
        products: false,
        revenue: false
    };
    layoutService = inject(LayoutService);
    authService = inject(AuthService);
    private shipmentView = inject(AppShipmentView);

    shipments: any[] = [];
    products: any[] = [];
    revenueData: any;
    savingsItems: any[] = [];

    constructor(
        private shipmentService: ShipmentService,
        private productService: ProductService,
        private ordersService: OrdersService,
    ) { }

    ngOnInit() {
        this.checkAuth();
        this.loadShipments();
        this.loadProducts();
        this.initRevenueChart();
    }
    currentUser: any = {
        userId: 0,
        role: ''
    }

    checkAuth() {
        this.authService.currentUser$.subscribe(user => {
            if (user) {
                this.currentUser.userId = user?.id;
                this.currentUser.role = user?.role;
            }
        })
    }

    getEvents(product: any) {
        const statusOrder = ['PENDING', 'PROCESSING', 'IN_TRANSIT', 'DELIVERED'];
        const currentIndex = statusOrder.indexOf(product.status);

        return statusOrder.map((status, index) => ({
            status,
            color: index <= currentIndex ? 'green' : '#999',
            ...(this.shipments?.[index] || {})
        }));
    }

    loadShipments() {
        this.loading.shipments = true;

        if (this.currentUser.role === 'COURIER') {
            // Couriers get shipments
            this.shipmentService.getShipments(undefined, undefined, this.currentUser.userId).subscribe({
                next: (data: any) => {
                    this.shipments = data.map((shipment: any) => ({
                        id: shipment.id,
                        orderId: shipment.farmerOrder?.id,
                        status: shipment.status,
                        estimatedDelivery: shipment.estimatedDeliveryDate,
                        trackingNumber: shipment.trackingNumber
                    }));
                    this.loading.shipments = false;
                },
                error: () => this.loading.shipments = false
            });
        } else {
            // Farmers and Restaurants get orders
            let params: any = {};
            if (this.currentUser.role === 'RESTAURANT') {
                params.restaurantId = this.authService.getProfileId();
            } else if (this.currentUser.role === 'FARMER') {
                params.farmerId = this.authService.getProfileId();
            }

            this.ordersService.listByRole(params).subscribe({
                next: (data: any) => {
                    this.shipments = data.map((order: any) => ({
                        id: order.id,
                        orderId: order.id,
                        status: order.status,
                        estimatedDelivery: order.estimatedDeliveryDate || order.createdAt,
                        trackingNumber: order.trackingNumber || `ORD-${order.id}`
                    }));
                    this.loading.shipments = false;
                },
                error: () => this.loading.shipments = false
            });
        }
    }

    loadProducts() {
        this.loading.products = true;
        this.productService.getProducts().subscribe({
            next: (products: any) => {
                this.products = products;
                this.processSavingsItems(products);
                this.loading.products = false;
            },
            error: () => this.loading.products = false
        });
    }

    processSavingsItems(products: any[]) {
        this.savingsItems = products
            .map((product: any) => ({
                sku: `FP${product.id.toString().padStart(5, '0')}`,
                name: product.name,
                savings: (product.price * 0.15), // Example calculation
                productId: product.id
            }))
            .sort((a: any, b: any) => b.savings - a.savings)
            .slice(0, 5);
    }

    chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true
            }
        },
        plugins: {
            legend: {
                reverse: true // Optional: keeps legend order matching visual stack
            }
        },
        // Alternatively, you can set bar width globally:
        datasets: {
            bar: {
                barThickness: 20, // Fixed width in pixels (or use 'flex' for dynamic)
                maxBarThickness: 30, // Maximum width
                minBarLength: 2, // Minimum length
            }
        }
    };

    initRevenueChart() {
        this.loading.revenue = true;
        this.ordersService.getRevenueData().subscribe({
            next: (data: any) => {
                console.log("data", data);

                this.revenueData = {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Revenue',
                        backgroundColor: '#4a9b3e',
                        data: data.monthlyRevenue
                    }]
                };
                this.loading.revenue = false;
            },
            error: () => this.loading.revenue = false
        });
    }

    getStatusColor(status: string) {
        const statusColors: Record<string, string> = {
            PENDING: 'bg-yellow-400',
            PROCESSING: 'bg-blue-400',
            PICKED_UP: 'bg-indigo-400',
            IN_TRANSIT: 'bg-purple-400',
            DELIVERED: 'bg-green-400',
            DELIVERY_FAILED: 'bg-red-400',
            RETURNED: 'bg-orange-400',
            CANCELLED: 'bg-gray-400'
        };
        return statusColors[status] || 'bg-gray-200';
    }

    filterOptions = [
        { label: 'Filter', value: 'all' },
        { label: 'Top 5', value: 'top5' },
        { label: 'Top 10', value: 'top10' }
    ];

    farmOptions = [
        { label: 'Farms', value: 'all' },
        { label: 'Stone Acres', value: 'stone' },
        { label: 'Green Fields', value: 'green' }
    ];

    timePeriodOptions = [
        { label: 'Time Period', value: 'month' },
        { label: 'This Quarter', value: 'quarter' },
        { label: 'This Year', value: 'year' }
    ];

    showShipmentView = false;
    currentShipment: any = null;
    viewShipment(shipment: any) {
        // Always create a new object reference to trigger change detection
        this.currentShipment = { ...shipment };
        this.showShipmentView = true;
    }

    onShipmentViewClosed() {
        this.showShipmentView = false;
        // Optional: Clear current shipment
        this.currentShipment = null;
    }
}