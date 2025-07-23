import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { OrdersService } from '@/service/orders.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ShipmentService } from '@/service/shipment.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from '@/auth/auth.service';
import * as L from 'leaflet';

@Component({
    selector: 'app-shipment-select-dialog',
    templateUrl: './shipment-select-dialog.component.html',
    standalone: true,
    imports: [DialogModule, ButtonModule, DropdownModule, FormsModule, CommonModule, ProgressSpinnerModule],
})
export class ShipmentSelectDialogComponent implements OnChanges, OnInit {
    @Input() orderId!: number;
    @Input() visible = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() shipmentSelected = new EventEmitter<any>();

    shipments: any[] = [];
    selectedShipment?: any;
    loading = false;
    currentUser: any = {
        userId: 0,
        role: ''
    };

    private map?: L.Map;
    private orderRouteLayer?: L.Polyline;
    private shipmentRouteLayer?: L.Polyline;
    private farmMarker?: L.Marker;
    private deliveryMarker?: L.Marker;
    private courierMarker?: L.Marker;

    constructor(
        private ordersService: OrdersService,
        private shipmentService: ShipmentService,
        private authService: AuthService,
    ) { }

    ngOnInit() {
        this.checkAuth();
    }

    checkAuth() {
        this.authService.currentUser$.subscribe(user => {
            if (user) {
                this.currentUser.userId = user?.id;
                this.currentUser.role = user?.role;
            }
        })
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['visible'] && changes['visible'].currentValue === true) {
            this.loadShipments();
            setTimeout(() => this.initMap(), 0);
        }
        if (changes['selectedShipment'] && this.selectedShipment) {
            this.updateShipmentRoute();
        }
        if (changes['visible'] && changes['visible'].currentValue === false) {
            // Dialog was closed, clean up
            this.cleanupMap();
        }
    }

    loadShipments() {
        this.loading = true;
        console.log(this.currentUser.role);
        
        if (this.currentUser.role === 'COURIER') {
            // Couriers get shipments
            this.shipmentService.getShipments(undefined, undefined, this.currentUser.userId).subscribe({
                next: (data) => {
                    this.shipments = data.map(shipment => ({
                        ...shipment,
                        label: `${shipment.trackingNumber} - ${shipment.status}` // Add tracking number to dropdown
                    }));
                    this.loading = false;
                },
                error: () => {
                    this.loading = false;
                }
            });
        } else {
            // Farmers and Restaurants get orders
            let params: any = {};
            if (this.currentUser.role === 'RESTAURANT') {
                params.restaurantId = this.currentUser.userId;
            } else if (this.currentUser.role === 'FARMER') {
                params.farmerId = this.currentUser.userId;
            }
            
            this.ordersService.listByRole(params).subscribe({
                next: (data) => {
                    this.shipments = data.map(order => ({
                        ...order,
                        id: order.id,
                        trackingNumber: `ORD-${order.id}`,
                        label: `ORD-${order.id} - ${order.status}` // Use order ID as tracking number
                    }));
                    this.loading = false;
                },
                error: () => {
                    this.loading = false;
                }
            });
        }
    }

    initMap() {
        this.cleanupMap();
        if (!document.getElementById('map')) {
            console.error('Map container not found');
            return;
        }

        // Default locations (Toronto)
        const farmLocation = L.latLng(43.6532, -79.3832); // Restaurant location
        const deliveryLocation = L.latLng(43.6510, -79.3470); // Customer location

        this.map = L.map('map').setView(farmLocation, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.map);

        // Add farm/restaurant marker
        this.farmMarker = L.marker(farmLocation, {
            icon: L.icon({
                iconUrl: '/images/map/farmer.jpg',
                iconSize: [32, 32],
                iconAnchor: [16, 32]
            })
        }).addTo(this.map).bindPopup('<b>Restaurant</b>');

        // Add delivery marker (customer location)
        this.deliveryMarker = L.marker(deliveryLocation, {
            icon: L.icon({
                iconUrl: '/images/map/delivery-marker.png',
                iconSize: [32, 32],
                iconAnchor: [16, 32]
            })
        }).addTo(this.map).bindPopup('<b>Customer Location</b>');

        // Draw order route (green) - from restaurant to customer
        this.drawRoute(farmLocation, deliveryLocation, '#10B981', 'order');
    }

    updateShipmentRoute() {
        if (!this.map || !this.selectedShipment || !this.farmMarker) return;

        // Get courier's current location from selected shipment
        const courierLocation = L.latLng(
            this.selectedShipment.currentLatitude || 43.6600,
            this.selectedShipment.currentLongitude || -79.3900
        );

        // Update or create courier marker
        if (this.courierMarker) {
            this.courierMarker.setLatLng(courierLocation);
        } else {
            this.courierMarker = L.marker(courierLocation, {
                icon: L.icon({
                    iconUrl: '/images/map/courier.png',
                    iconSize: [32, 32],
                    iconAnchor: [16, 32]
                })
            }).addTo(this.map).bindPopup('<b>Courier Location</b>');
        }

        // Draw shipment route (blue) - from courier to restaurant
        this.drawRoute(courierLocation, this.farmMarker.getLatLng(), '#3B82F6', 'shipment');
    }

    drawRoute(start: L.LatLng, end: L.LatLng, color: string, routeType: 'order' | 'shipment') {
        const coordsStr = `${start.lng},${start.lat};${end.lng},${end.lat}`;

        fetch(`https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`)
            .then(res => res.json())
            .then(data => {
                const coords = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);

                // Remove previous route layer of this type
                if (routeType === 'order' && this.orderRouteLayer) {
                    this.orderRouteLayer.remove();
                } else if (routeType === 'shipment' && this.shipmentRouteLayer) {
                    this.shipmentRouteLayer.remove();
                }

                // Create new route layer
                const routeLayer = L.polyline(coords, {
                    color: color,
                    weight: 5,
                    opacity: 0.7,
                    dashArray: routeType === 'shipment' ? '5, 5' : undefined // Make shipment route dashed
                }).addTo(this.map!);

                // Store reference to the layer
                if (routeType === 'order') {
                    this.orderRouteLayer = routeLayer;
                } else {
                    this.shipmentRouteLayer = routeLayer;
                }

                // Fit bounds to show all routes and markers
                const bounds = this.getAllRouteBounds();
                if (bounds) {
                    this.map!.fitBounds(bounds.pad(0.2));
                }
            })
            .catch(err => console.error('Route fetch failed', err));
    }

    getAllRouteBounds(): L.LatLngBounds | null {
        const bounds = new L.LatLngBounds([]);
        let hasBounds = false;

        if (this.orderRouteLayer) {
            bounds.extend(this.orderRouteLayer.getBounds());
            hasBounds = true;
        }
        if (this.shipmentRouteLayer) {
            bounds.extend(this.shipmentRouteLayer.getBounds());
            hasBounds = true;
        }
        if (this.farmMarker) {
            bounds.extend(this.farmMarker.getLatLng());
            hasBounds = true;
        }
        if (this.deliveryMarker) {
            bounds.extend(this.deliveryMarker.getLatLng());
            hasBounds = true;
        }
        if (this.courierMarker) {
            bounds.extend(this.courierMarker.getLatLng());
            hasBounds = true;
        }

        return hasBounds ? bounds : null;
    }

    cleanupMap() {
        if (this.orderRouteLayer) {
            this.orderRouteLayer.remove();
            this.orderRouteLayer = undefined;
        }
        if (this.shipmentRouteLayer) {
            this.shipmentRouteLayer.remove();
            this.shipmentRouteLayer = undefined;
        }
        if (this.farmMarker) {
            this.farmMarker.remove();
            this.farmMarker = undefined;
        }
        if (this.deliveryMarker) {
            this.deliveryMarker.remove();
            this.deliveryMarker = undefined;
        }
        if (this.courierMarker) {
            this.courierMarker.remove();
            this.courierMarker = undefined;
        }
        if (this.map) {
            this.map.remove();
            this.map = undefined;
        }
    }

    onSelect() {
        if (this.selectedShipment) {
            this.shipmentSelected.emit(this.selectedShipment);
            this.visible = false;
        }
    }

    onCancel() {
        this.closeDialog();
    }

    closeDialog() {
        this.visible = false;
        this.visibleChange.emit(false);
    }
}