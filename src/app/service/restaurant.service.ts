// restaurant.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Adjust the path as necessary

export interface Restaurant {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  website: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private apiUrl = environment.apiUrl + "restaurants";
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

  getRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  createRestaurant(restaurant: Restaurant): Observable<Restaurant> {
    return this.http.post<Restaurant>(this.apiUrl, restaurant, { headers: this.getAuthHeaders() });
  }

  updateRestaurant(id: number, restaurant: Restaurant): Observable<Restaurant> {
    return this.http.post<Restaurant>(`${this.apiUrl}/${id}`, restaurant, { headers: this.getAuthHeaders() });
  }

  deleteRestaurant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}