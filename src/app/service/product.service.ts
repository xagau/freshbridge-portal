// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '@/auth/auth.service';

export interface Product {
  id: number;
  farmerId: number;
  name: string;
  description: string;
  price: number;
  farmer: any;
  unit: string;
  quantityAvailable: number;
  imageUrls: string[];
  harvestDateStr: string;
  harvestDate: string;
  rating?: number; // Optional field for UI
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API = environment.apiUrl + 'farm-products';
  private authCredentials = {
    username: 'admin',
    password: '6f4acf41-b6ad-483f-bc35-abe48b9fd58a'
  };

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const authString = btoa(`${this.authCredentials.username}:${this.authCredentials.password}`);
    return new HttpHeaders({
      'Authorization': `Basic ${authString}`,
      'Content-Type': 'application/json'
    });
  }

  getProducts(): Observable<Product[]> {
    console.log(this.authService.currentUserValue);

    if (this.authService.currentUserValue?.role === 'FARMER') {
      return this.http.get<Product[]>(`${this.API}?farmerId=${this.authService.getProfileId()}`, { headers: this.getAuthHeaders() });
    } else if (this.authService.currentUserValue?.role === 'RESTAURANT') {
      return this.http.get<Product[]>(`${this.API}?restaurantId=${this.authService.getProfileId()}`, { headers: this.getAuthHeaders() });
    } else if (this.authService.currentUserValue?.role === 'ADMIN') {
      return this.http.get<Product[]>(this.API, { headers: this.getAuthHeaders() });
    } else {
      return of([]);
    }
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API}/${id}`, { headers: this.getAuthHeaders() });
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.API, product, { headers: this.getAuthHeaders() });
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.API}/${id}`, product, { headers: this.getAuthHeaders() });
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`, { headers: this.getAuthHeaders() });
  }

  uploadProductImages(productId: number, images: File[]): Observable<{ imageUrls: string[] }> {
    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image);
    });

    // Only set Authorization header, NOT Content-Type
    const authString = btoa(`${this.authCredentials.username}:${this.authCredentials.password}`);
    const headers = new HttpHeaders({
      'Authorization': `Basic ${authString}`
    });

    return this.http.post<{ imageUrls: string[] }>(
      `${this.API}/${productId}/images`,
      formData,
      { headers }
    );
  }
}