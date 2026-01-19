// merchant-product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface MerchantProduct {
    id: number;
    name: string;
    description?: string;
    price: number;
    unit?: string;
    quantityAvailable: number;
    imageUrl?: string;
    harvestDate?: string;
    merchant?: {
        id: number;
        firstName: string;
        lastName: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class MerchantProductService {
    private apiUrl = `${environment.apiUrl}/merchant-products`;

    constructor(private http: HttpClient) { }

    /**
     * Get all merchant products with optional filters
     */
    getProducts(params?: {
        merchantId?: number;
        name?: string;
    }): Observable<MerchantProduct[]> {
        return this.http.get<MerchantProduct[]>(this.apiUrl, { params });
    }

    /**
     * Get a single product by ID
     */
    getProduct(productId: number): Observable<MerchantProduct> {
        return this.http.get<MerchantProduct>(`${this.apiUrl}/${productId}`);
    }

    /**
     * Create a new merchant product
     */
    createProduct(productData: {
        merchantId: number;
        name: string;
        description?: string;
        price: number;
        unit?: string;
        quantityAvailable: number;
        imageUrl?: string;
        harvestDate?: string;
    }): Observable<MerchantProduct> {
        return this.http.post<MerchantProduct>(this.apiUrl, productData);
    }

    /**
     * Update a product using query parameters
     */
    updateProduct(
        productId: number,
        updates: {
            name?: string;
            description?: string;
            price?: number;
            unit?: string;
            quantityAvailable?: number;
            imageUrl?: string;
            harvestDate?: string;
        }
    ): Observable<MerchantProduct> {
        // Convert updates to query parameters
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(updates)) {
            if (value !== undefined) {
                params.set(key, value.toString());
            }
        }

        return this.http.put<MerchantProduct>(`${this.apiUrl}/${productId}?${params.toString()}`, {});
    }

    /**
     * Delete a product
     */
    deleteProduct(productId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${productId}`);
    }

    /**
     * Get popular products (sorted by quantity available)
     */
    getPopularProducts(limit: number = 5): Observable<MerchantProduct[]> {
        return this.http.get<MerchantProduct[]>(`${this.apiUrl}?sort=quantityAvailable,desc&limit=${limit}`);
    }

    /**
     * Get products with highest savings (calculated as price * quantity)
     */
    getTopSavingsProducts(limit: number = 5): Observable<MerchantProduct[]> {
        return this.http.get<MerchantProduct[]>(`${this.apiUrl}?sort=price,desc&limit=${limit}`);
    }
}
