// buyer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Adjust the path as necessary

export interface Buyer {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  website: string;
  userId: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  accountbalance?: number;
}

@Injectable({
  providedIn: 'root'
})
export class BuyerService {
  private apiUrl = environment.apiUrl + "buyers";
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

  getBuyers(): Observable<Buyer[]> {
    return this.http.get<Buyer[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  createBuyer(buyer: Buyer): Observable<Buyer> {
    return this.http.post<Buyer>(this.apiUrl, buyer, { headers: this.getAuthHeaders() });
  }

  updateBuyer(id: number, buyer: Buyer): Observable<Buyer> {
    return this.http.put<Buyer>(`${this.apiUrl}/${id}`, buyer, { headers: this.getAuthHeaders() });
  }

  deleteBuyer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
