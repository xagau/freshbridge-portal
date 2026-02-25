import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrdersService } from './orders.service';
import { AuthService } from '@/auth/auth.service';
import { Order } from '@/model/order.model';

@Injectable({
    providedIn: 'root'
})
export class DashboardDataService {
    private ordersSubject = new BehaviorSubject<Order[]>([]);
    private isLoadingSubject = new BehaviorSubject<boolean>(false);
    private hasLoadedSubject = new BehaviorSubject<boolean>(false);

    constructor(
        private ordersService: OrdersService,
        private authService: AuthService
    ) { }

    get orders$(): Observable<Order[]> {
        return this.ordersSubject.asObservable();
    }

    get isLoading$(): Observable<boolean> {
        return this.isLoadingSubject.asObservable();
    }

    get hasLoaded$(): Observable<boolean> {
        return this.hasLoadedSubject.asObservable();
    }

    loadOrders(): void {
        // Only load if we haven't already loaded or are currently loading
        if (this.hasLoadedSubject.value || this.isLoadingSubject.value) {
            return;
        }

        this.isLoadingSubject.next(true);

        // Get current user ID
        const userId = this.authService.currentUserValue?.id;

        if (!userId) {
            console.error('No user ID available');
            this.isLoadingSubject.next(false);
            return;
        }

        // Use userId parameter instead of role-specific parameters
        const isAdmin = this.authService.currentUserValue?.role === 'ADMIN';
        const params = { userId, isAdmin };

        this.ordersService.listByRole(params).subscribe({
            next: (orders: Order[]) => {
                console.log('Dashboard data service loaded orders:', orders);
                this.ordersSubject.next(orders);
                this.isLoadingSubject.next(false);
                this.hasLoadedSubject.next(true);
            },
            error: (error) => {
                console.error('Error loading orders:', error);
                this.isLoadingSubject.next(false);
            }
        });
    }

    // Method to force reload if needed
    reloadOrders(): void {
        this.hasLoadedSubject.next(false);
        this.loadOrders();
    }
}