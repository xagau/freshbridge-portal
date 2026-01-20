import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export type ShipmentStatus = 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Shipment {
    id: number;
    merchantOrder: any; // You may want to define a MerchantOrder interface
    trackingNumber: string;
    carrier: string;
    shippingMethod: string;
    shippingCost: number;
    deliveryAddress: string;
    deliveryCity: string;
    deliveryState: string;
    deliveryZip: string;
    deliveryInstructions: string;
    estimatedDeliveryDate: string;
    status: ShipmentStatus;
    items?: ShipmentItem[];
}

export interface ShipmentItem {
    id: number;
    productName: string;
    quantity: number;
    unit: string;
    // Add other fields as needed
}

export interface ShipmentRequest {
    merchantOrderId: number;
    trackingNumber: string;
    carrier: string;
    shippingMethod: string;
    shippingCost: number;
    deliveryAddress: string;
    deliveryCity: string;
    deliveryState: string;
    deliveryZip: string;
    deliveryInstructions: string;
    estimatedDeliveryDate: string;
}

@Injectable({
    providedIn: 'root'
})
export class ShipmentService {
    private apiUrl = environment.apiUrl + 'shipments';
    private authCredentials = {
        username: 'admin',
        password: '6f4acf41-b6ad-483f-bc35-abe48b9fd58a'
    };

    constructor(private http: HttpClient) { }

    private getAuthHeaders(): HttpHeaders {
        const authString = btoa(`${this.authCredentials.username}:${this.authCredentials.password}`);
        return new HttpHeaders({
            'Authorization': `Basic ${authString}`,
            'Content-Type': 'application/json'
        });
    }

    createShipment(request: ShipmentRequest): Observable<Shipment> {
        return this.http.post<Shipment>(this.apiUrl, request, { headers: this.getAuthHeaders() });
    }

    getShipments(
        OrderId?: number, 
        status?: ShipmentStatus,
        courierId?: number
    ): Observable<Shipment[]> {
        let params = new HttpParams();
        if (status) {
            params = params.set('status', status);
        }
        if (courierId) {
            params = params.set('courierId', courierId.toString());
        }
        return this.http.get<Shipment[]>(this.apiUrl, { params, headers: this.getAuthHeaders() });
    }

    // getShipmentById(shipmentId: string): Observable<any> {
    //     return this.http.get<any>(`${this.apiUrl}/${shipmentId}`);
    // }

    getShipmentItems(shipmentId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/${shipmentId}/items`);
    }

    getShipment(id: number): Observable<Shipment> {
        return this.http.get<Shipment>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
    }

    updateStatus(shipmentId: number, status: string): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${shipmentId}/status?status=${status}`, {}, { headers: this.getAuthHeaders() });
    }

    addToShipment(shipmentId: number, orderId: number) {
        const quantityShipped = 20;
        return this.http.post(
            `${this.apiUrl}/${shipmentId}/items`,
            { orderId, quantityShipped },
            {
                headers: this.getAuthHeaders(),
                observe: 'response' // This gives us access to the full response
            }
        ).pipe(
            catchError((error: HttpErrorResponse) => {
                // Extract the error message from the response
                let errorMessage = 'Failed to add order to shipment';
                if (error.error instanceof ErrorEvent) {
                    // Client-side error
                    errorMessage = `Error: ${error.error.message}`;
                } else {
                    // Server-side error - try to get the message from the response
                    errorMessage = error.error?.message || error.message || error.statusText;
                }
                // Throw a new error with the message
                return throwError(() => new Error(errorMessage));
            })
        );
    }
}