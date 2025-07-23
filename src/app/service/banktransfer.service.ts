import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BankTransferService {
    private readonly API = environment.apiUrl + 'bank-transfers';
    // private _order = signal<any[]>([]);

    constructor(private http: HttpClient) { }

    // Get revenue data for charts
    getRevenueData(): Observable<any> {
        return this.http.get<any>(`${this.API}/summary`, {
            params: {
                accountId: '1' // You might want to make this dynamic
            }
        });
    }

}