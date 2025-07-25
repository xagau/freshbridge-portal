import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Order } from '../model/order.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrdersService {
    private readonly API = environment.apiUrl + 'orders';
    private _order = signal<any[]>([]);

    constructor(private http: HttpClient) { }

    // Get all orders with optional filters
    getAll(): Observable<Order[]> {
        return this.http.get<Order[]>(this.API);
    }

    // Get orders by role with filters
    listByRole(params: {
        restaurantId?: number | null,
        farmerId?: number | null,
        courierId?: number | null,
        status?: string | null
    }): Observable<Order[]> {
        // Remove null or undefined params and use snake_case
        const httpParams: any = {};
        if (params.restaurantId != null) httpParams.restaurant_id = params.restaurantId.toString();
        if (params.farmerId != null) httpParams.farmer_id = params.farmerId.toString();
        if (params.courierId != null) httpParams.courier_id = params.courierId.toString();
        if (params.status != null) httpParams.status = params.status;

        return this.http.get<Order[]>(this.API, {
            params: httpParams
        });
    }

    // Get orders for a specific user
    getOrdersByUser(userId: number, params: { status?: string | null }): Observable<Order[]> {
        console.log("user ID:" + userId);
        console.log("params:" + params);

        const httpParams: any = {};
        if (params.status != null) httpParams.status = params.status;

        return this.http.get<Order[]>(`${environment.apiUrl}users/${userId}/orders`, {
            params: httpParams
        });
    }

    // OrdersService.ts
    getAllOrdersByRole(params: {
        restaurantId?: number;
        farmerId?: number;
        courierId?: number;
        status?: string;
    }): Observable<Order[]> {
        // Build HttpParams dynamically
        let httpParams = new HttpParams();
    
        if (params.restaurantId) {
        httpParams = httpParams.set('restaurantId', params.restaurantId.toString());
        }
        if (params.farmerId) {
        httpParams = httpParams.set('farmerId', params.farmerId.toString());
        }
        if (params.courierId) {
        httpParams = httpParams.set('courierId', params.courierId.toString());
        }
        if (params.status) {
        httpParams = httpParams.set('status', params.status);
        }
    
        console.log('✅ getAllOrdersByRole called with params:', httpParams.toString());
    
        return this.http.get<Order[]>(`${environment.apiUrl}orders`, {
        params: httpParams
        });
    }
   
    // Get a specific order by ID
    getOrderById(orderId: number): Observable<Order> {
        return this.http.get<Order>(`${this.API}/${orderId}`);
    }

    // Create a new scheduled order
    createOrder(scheduleOrder: {
        restaurantId: number,
        farmerId: number,
        startDate: string,
        frequency: string,
        repeatOnDays: string,
        openEnd: boolean,
        endDate: string | null,
        deliveryAddress: string,
    }): Observable<Order> {
        return this.http.post<Order>(this.API, scheduleOrder);
    }

    // Update order status
    updateStatus(orderId: number, status: string): Observable<Order> {
        return this.http.put<Order>(
            `${this.API}/${orderId}/status?status=${status}`,
            {}
        );
    }

    // Mark order as paid
    markPaid(orderId: number): Observable<Order> {
        return this.http.post<Order>(
            `${this.API}/${orderId}/pay`,
            {}
        );
    }

    // Get revenue data for charts
    getRevenueData(): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}bank-transfers/summary`, {
            params: {
                accountId: '1' // You might want to make this dynamic
            }
        });
    }

    // Get order summary for a restaurant
    getRestaurantOrderSummary(restaurantId: number): Observable<any> {
        return this.http.get<any>(
            `${environment.apiUrl}restaurants/${restaurantId}/orders/summary`
        );
    }

    // Get orders by date range
    getOrdersByDateRange(restaurantId: number, startDate: Date, endDate: Date): Observable<Order[]> {
        return this.http.get<Order[]>(
            `${environment.apiUrl}restaurants/${restaurantId}/orders/date-range`,
            {
                params: {
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString()
                }
            }
        );
    }


    addItemToOrder(orderId: number, item: { productId: number, quantity: number }): Observable<any> {
        return this.http.post<any>(
            `${this.API}/${orderId}/items`,
            item
        );
    }

    // Signal-based cart functionality
    get order() {
        return this._order();
    }

    addToOrder(item: any) {
        this._order.set([...this._order(), item]);
    }

    clearOrder() {
        this._order.set([]);
    }


    getScheduleSummary(order: {
        selectedFrequency: { value: string, label?: string },
        weekDays?: { label: string, value: string, selected: boolean }[],
        customFrequencyValue?: number,
        customFrequencyUnit?: { label: string, value: string },
        startDate: Date,
        endCondition: string,
        endDate?: Date | null,
        deliveryAddress?: string
    }): string {
        let summary = '';
        if (order.selectedFrequency.value === 'weekly') {
            const selectedDays = order.weekDays?.filter(d => d.selected).map(d => d.label) ?? [];
            if (selectedDays.length === 0) return 'Please select days for weekly schedule';

            let endText = '';
            if (order.endCondition === 'date' && order.endDate) {
                endText = ` until ${order.endDate.toLocaleDateString()}`;
            }

            summary = `Delivers every ${selectedDays.join(', ')}${endText}`;
        }

        if (order.selectedFrequency.value === 'biweekly') {
            summary = `Delivers every 2 weeks${this.getEndText(order)}`;
        }

        if (order.selectedFrequency.value === 'monthly') {
            summary = `Delivers monthly on day ${order.startDate.getDate()}${this.getEndText(order)}`;
        }

        if (order.selectedFrequency.value === 'custom' && order.customFrequencyValue && order.customFrequencyUnit) {
            summary = `Delivers every ${order.customFrequencyValue} ${order.customFrequencyUnit.label}${this.getEndText(order)}`;
        }

        if (order.deliveryAddress) {
            summary += ` | Address: ${order.deliveryAddress}`;
        }

        return summary;
    }
    private getEndText(order: {
        endCondition: string,
        endDate?: Date | null,
        occurrences?: number
    }): string {
        if (order.endCondition === 'date' && order.endDate) {
            return ` until ${order.endDate.toLocaleDateString()}`;
        }
        return '';
    }

}