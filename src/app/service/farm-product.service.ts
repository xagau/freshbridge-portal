// farm-product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface FarmProduct {
    id: number;
    name: string;
    description?: string;
    price: number;
    unit?: string;
    quantityAvailable: number;
    imageUrl?: string;
    harvestDate?: string;
    farmer?: {
        id: number;
        firstName: string;
        lastName: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class FarmProductService {
    private apiUrl = `${environment.apiUrl}/farm-products`;

    constructor(private http: HttpClient) { }

    /**
     * Get all farm products with optional filters
     */
    getProducts(params?: {
        farmerId?: number;
        name?: string;
    }): Observable<FarmProduct[]> {
        return this.http.get<FarmProduct[]>(this.apiUrl, { params });
    }

    /**
     * Get a single product by ID
     */
    getProduct(productId: number): Observable<FarmProduct> {
        return this.http.get<FarmProduct>(`${this.apiUrl}/${productId}`);
    }

    /**
     * Create a new farm product
     */
    createProduct(productData: {
        farmerId: number;
        name: string;
        description?: string;
        price: number;
        unit?: string;
        quantityAvailable: number;
        imageUrl?: string;
        harvestDate?: string;
    }): Observable<FarmProduct> {
        return this.http.post<FarmProduct>(this.apiUrl, productData);
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
    ): Observable<FarmProduct> {
        // Convert updates to query parameters
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(updates)) {
            if (value !== undefined) {
                params.set(key, value.toString());
            }
        }

        return this.http.put<FarmProduct>(`${this.apiUrl}/${productId}?${params.toString()}`, {});
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
    getPopularProducts(limit: number = 5): Observable<FarmProduct[]> {
        return this.http.get<FarmProduct[]>(`${this.apiUrl}?sort=quantityAvailable,desc&limit=${limit}`);
    }

    /**
     * Get products with highest savings (calculated as price * quantity)
     */
    getTopSavingsProducts(limit: number = 5): Observable<FarmProduct[]> {
        return this.http.get<FarmProduct[]>(`${this.apiUrl}?sort=price,desc&limit=${limit}`);
    }
}