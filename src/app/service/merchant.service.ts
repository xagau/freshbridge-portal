import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment'; // Adjust the path as necessary
import { delay } from 'rxjs/operators';

export interface Merchant {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  merchantEstablishedDate: string;
  merchantType: 'ORGANIC' | 'CONVENTIONAL' | 'HYDROPONIC' | 'AQUAPONIC';
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  language: string;
  timezone: string;
  communicationPreference: 'EMAIL' | 'SMS' | 'PHONE' | 'MAIL';
  organicCertification: boolean;
  certificationDate: string;
  accountbalance?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MerchantService {
  private apiUrl = environment.apiUrl + "merchants";
  private authCredentials = {
    username: 'admin', // Replace with your actual username
    password: '6f4acf41-b6ad-483f-bc35-abe48b9fd58a'  // Replace with your actual password
  };

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    // Create base64 encoded string from username:password
    const authString = btoa(`${this.authCredentials.username}:${this.authCredentials.password}`);
    return new HttpHeaders({
      'Authorization': `Basic ${authString}`,
      'Content-Type': 'application/json'
    });
  }

  getMerchants(): Observable<Merchant[]> {
    return this.http.get<Merchant[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  createMerchant(merchant: Merchant): Observable<Merchant> {
    return this.http.post<Merchant>(this.apiUrl, merchant, { headers: this.getAuthHeaders() });
  }

  updateMerchant(id: number, merchant: Merchant): Observable<Merchant> {
    return this.http.post<Merchant>(`${this.apiUrl}/${id}`, merchant, { headers: this.getAuthHeaders() });
  }

  deleteMerchant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
