import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment'; // Adjust the path as necessary
import { delay } from 'rxjs/operators';

export interface Farmer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  farmEstablishedDate: string;
  farmType: 'ORGANIC' | 'CONVENTIONAL' | 'HYDROPONIC' | 'OTHER';
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  language: string;
  timezone: string;
  communicationPreference: 'EMAIL' | 'SMS' | 'PHONE' | 'MAIL';
  emergencyContactName: string;
  emergencyContactPhone: string;
  organicCertification: boolean;
  certificationDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class FarmerService {
  private apiUrl = environment.apiUrl + "farmers";
  private authCredentials = {
    username: 'admin', // Replace with your actual username
    password: '6f4acf41-b6ad-483f-bc35-abe48b9fd58a'  // Replace with your actual password
  };

  // Mock data
  // private mockFarmers: Farmer[] = [
  //   {
  //     id: 1,
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     email: 'john@example.com',
  //     phoneNumber: '1234567890',
  //     farmEstablishedDate: '2010-05-01',
  //     farmType: 'ORGANIC',
  //     active: true,
  //     createdAt: '2023-01-01',
  //     updatedAt: '2023-01-01',
  //     lastLogin: '2023-06-01',
  //     language: 'en',
  //     timezone: 'UTC',
  //     communicationPreference: 'EMAIL',
  //     emergencyContactName: 'Jane Doe',
  //     emergencyContactPhone: '0987654321',
  //     organicCertification: true,
  //     certificationDate: '2015-06-01'
  //   },
  //   {
  //     id: 2,
  //     firstName: 'Alice',
  //     lastName: 'Smith',
  //     email: 'alice@example.com',
  //     phoneNumber: '5551234567',
  //     farmEstablishedDate: '2015-08-15',
  //     farmType: 'CONVENTIONAL',
  //     active: false,
  //     createdAt: '2023-02-01',
  //     updatedAt: '2023-02-01',
  //     lastLogin: '2023-06-10',
  //     language: 'en',
  //     timezone: 'UTC',
  //     communicationPreference: 'SMS',
  //     emergencyContactName: 'Bob Smith',
  //     emergencyContactPhone: '5559876543',
  //     organicCertification: false,
  //     certificationDate: ''
  //   }
  // ];

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    // Create base64 encoded string from username:password
    const authString = btoa(`${this.authCredentials.username}:${this.authCredentials.password}`);
    return new HttpHeaders({
      'Authorization': `Basic ${authString}`,
      'Content-Type': 'application/json'
    });
  }

  getFarmers(): Observable<Farmer[]> {
    return this.http.get<Farmer[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  createFarmer(farmer: Farmer): Observable<Farmer> {
    return this.http.post<Farmer>(this.apiUrl, farmer, { headers: this.getAuthHeaders() });
  }

  updateFarmer(id: number, farmer: Farmer): Observable<Farmer> {
    return this.http.post<Farmer>(`${this.apiUrl}/${id}`, farmer, { headers: this.getAuthHeaders() });
  }

  deleteFarmer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
  // getFarmers(): Observable<Farmer[]> {
  //   return of(this.mockFarmers).pipe(delay(500));
  // }

  // createFarmer(farmer: Farmer): Observable<Farmer> {
  //   const newFarmer = { ...farmer, id: Date.now() };
  //   this.mockFarmers.push(newFarmer);
  //   return of(newFarmer).pipe(delay(500));
  // }

  // updateFarmer(id: number, farmer: Farmer): Observable<Farmer> {
  //   const index = this.mockFarmers.findIndex(f => f.id === id);
  //   if (index !== -1) {
  //     this.mockFarmers[index] = { ...farmer, id };
  //     return of(this.mockFarmers[index]).pipe(delay(500));
  //   }
  //   throw new Error('Farmer not found');
  // }

  // deleteFarmer(id: number): Observable<void> {
  //   this.mockFarmers = this.mockFarmers.filter(f => f.id !== id);
  //   return of(undefined).pipe(delay(500));
  // }
}