import {
    Component, Input, OnChanges, Output, EventEmitter, AfterViewInit, OnDestroy
} from '@angular/core';
import { OrdersService } from '@/service/orders.service';
import { Order } from '@/model/order.model';
import * as L from 'leaflet';

import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { AuthService } from '@/auth/auth.service';

import { StatusColorPipe } from '@/shared/pipes/status-color.pipe';

@Component({
    selector: 'fc-order-detail',
    templateUrl: './order-detail.component.html',
    imports: [
        DropdownModule,
        StatusColorPipe,
        TableModule,
        ProgressBarModule,
        DialogModule,
        ButtonModule,
        TagModule,
        ToastModule,
        ProgressSpinnerModule,
        FormsModule,
        CommonModule
    ],
    providers: [MessageService],
    standalone: true,
    styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnChanges, AfterViewInit, OnDestroy {
    @Input() orderId!: number;
    @Input() currentUser!: any;
    @Output() updated = new EventEmitter<void>();

    order?: Order;
    loading = true;
    private map?: L.Map;
    private routeLayer?: L.Polyline;
    private courierMarker?: L.Marker;
    private moveInterval?: any;

    private courierIcon = L.icon({
        iconUrl: '/images/map/courier.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
    });

    constructor(
        private ordersSvc: OrdersService,
        private messageService: MessageService,
        public authService: AuthService
    ) { }

    ngOnChanges() {
        this.load();
    }

    ngOnDestroy() {
        this.cleanupMap();
    }

    bgColors = ['var(--p-primary-color)'];

    ngAfterViewInit() {
        if (this.showTracking()) {
            setTimeout(() => this.initMap(), 0);
        }
    }

    load() {
        this.loading = true;
        this.ordersSvc.getOrderById(this.orderId).subscribe(order => {
            this.order = order ?? undefined;
            this.loading = false;
            if (this.showTracking()) {
                setTimeout(() => this.initMap(), 0);
            } else {
                this.cleanupMap();
            }
        });
    }

    showTracking(): boolean {
        return this.order?.status !== 'PENDING' &&
            this.order?.status !== 'REJECTED' &&
            this.order?.status !== 'DELIVERED' &&
            this.order?.status !== 'CANCELLED';
    }

    cleanupMap() {
        if (this.routeLayer) {
            this.routeLayer.remove();
            this.routeLayer = undefined;
        }
        if (this.courierMarker) {
            this.courierMarker.remove();
            this.courierMarker = undefined;
        }
        if (this.map) {
            this.map.remove();
            this.map = undefined;
        }
        if (this.moveInterval) {
            clearInterval(this.moveInterval);
            this.moveInterval = undefined;
        }
    }

    initMap() {
        this.cleanupMap();
        if (!document.getElementById('map')) {
            console.error('Map container not found');
            return;
        }

        const farmLocation = L.latLng(43.6532, -79.3832);
        const deliveryLocation = L.latLng(43.6510, -79.3470);

        this.map = L.map('map').setView(farmLocation, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.map);

        L.marker(farmLocation, {
            icon: L.icon({
                iconUrl: '/images/map/farmer.jpg',
                iconSize: [32, 32],
                iconAnchor: [16, 32]
            })
        }).addTo(this.map).bindPopup('<b>Restaurant</b>');

        L.marker(deliveryLocation, {
            icon: L.icon({
                iconUrl: '/images/map/delivery-marker.png',
                iconSize: [32, 32],
                iconAnchor: [16, 32]
            })
        }).addTo(this.map).bindPopup('<b>Delivery Address</b>');

        const coordsStr = `${farmLocation.lng},${farmLocation.lat};${deliveryLocation.lng},${deliveryLocation.lat}`;
        fetch(`https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`)
            .then(res => res.json())
            .then(data => {
                const coords = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
                this.routeLayer = L.polyline(coords, { color: '#3B82F6', weight: 5, opacity: 0.7 }).addTo(this.map!);
                this.map!.fitBounds(this.routeLayer.getBounds().pad(0.2));
                this.startCourierSimulation(coords, 30);  // 30 km/h example speed
            })
            .catch(err => console.error('Route fetch failed', err));
    }

    startCourierSimulation(route: [number, number][], speedKmh: number) {
        if (!this.map) return;

        this.courierMarker = L.marker(route[0], { icon: this.courierIcon }).addTo(this.map);
        let currentIndex = 0;

        const totalDistance = this.computeRouteDistance(route); // in meters
        const speedMs = (speedKmh * 1000) / 3600; // km/h to m/s

        let traveled = 0;
        let lastTime = performance.now();

        this.moveInterval = setInterval(() => {
            const now = performance.now();
            const dt = (now - lastTime) / 1000; // sec
            lastTime = now;
            traveled += speedMs * dt;

            const progress = traveled / totalDistance;
            if (progress >= 1) {
                this.courierMarker!.setLatLng(route[route.length - 1]);
                clearInterval(this.moveInterval);
                return;
            }

            // Find position along route
            const targetDist = traveled;
            let accum = 0;
            for (let i = 0; i < route.length - 1; i++) {
                const segDist = this.distance(route[i], route[i + 1]);
                if (accum + segDist >= targetDist) {
                    const ratio = (targetDist - accum) / segDist;
                    const lat = route[i][0] + (route[i + 1][0] - route[i][0]) * ratio;
                    const lng = route[i][1] + (route[i + 1][1] - route[i][1]) * ratio;
                    this.courierMarker!.setLatLng([lat, lng]);
                    break;
                }
                accum += segDist;
            }
        }, 50);  // 50 ms update
    }

    computeRouteDistance(route: [number, number][]): number {
        let dist = 0;
        for (let i = 0; i < route.length - 1; i++) {
            dist += this.distance(route[i], route[i + 1]);
        }
        return dist;
    }

    distance(a: [number, number], b: [number, number]): number {
        const latlngA = L.latLng(a[0], a[1]);
        const latlngB = L.latLng(b[0], b[1]);
        return latlngA.distanceTo(latlngB);
    }

    changeStatus(next: string) {
        this.ordersSvc.updateStatus(this.orderId, next).subscribe(() => {
            this.load();
            this.updated.emit();
        });
    }

    validTransitions(status: string): string[] {
        const map: Record<string, string[]> = {
            PENDING: ['ACCEPTED', 'REJECTED', 'CANCELLED'],
            ACCEPTED: ['PREPARING'],
            PREPARING: ['READY_FOR_PICKUP'],
            READY_FOR_PICKUP: ['DELIVERED'],
            DELIVERED: ['COMPLETED']
        };
        return map[status] ?? [];
    }

    isCourier(): boolean {
        // Check if the currentUser has the COURIER role
        return this.currentUser?.role === 'COURIER';
    }

    canMarkAsComplete(): boolean {
        const canComplete = !!this.order &&
            this.isCourier() &&
            this.order.status !== 'COMPLETED' &&
            this.order.status !== 'CANCELLED';

        // console.log('Can mark as complete:', {
        //     hasOrder: !!this.order,
        //     isCourier: this.isCourier(),
        //     currentUserRole: this.currentUser?.role,
        //     orderStatus: this.order?.status,
        //     canComplete
        // });

        return canComplete;
    }

    markAsComplete() {
        if (!this.order || !this.canMarkAsComplete()) return;

        this.loading = true;
        this.ordersSvc.updateStatus(this.orderId, 'COMPLETED').subscribe({
            next: () => {
                this.loading = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Order marked as completed successfully'
                });
                // Emit the updated event without reloading the current order
                // This will refresh the order list in the parent component
                this.updated.emit();

                // No need to call this.load() as we're closing the modal
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to update order status'
                });
                console.error('Error updating order status:', error);
            }
        });
    }

    isRestaurantOwner(): boolean {
        if (this.currentUser?.role !== 'RESTAURANT' || !this.order) return false;
        return true;
    }

    canCancelOrder(): boolean {
        
        if (!this.isRestaurantOwner() || !this.order) return false;
        // Can cancel if order is not already cancelled, completed, or delivered
        return this.order.status !== 'CANCELLED' &&
            this.order.status !== 'COMPLETED' &&
            this.order.status !== 'DELIVERED';
    }

    cancelOrder() {
        if (!this.order || !this.canCancelOrder()) return;

        this.loading = true;
        this.ordersSvc.updateStatus(this.orderId, 'CANCELLED').subscribe({
            next: () => {
                this.loading = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Order cancelled successfully'
                });
                this.load();
                this.updated.emit();
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to cancel order'
                });
                console.error('Error cancelling order:', error);
            }
        });
    }
}
