import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Account } from '@/auth/interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private readonly API = environment.apiUrl + 'accounts';
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

    getAccounts(): Observable<Account[]> {
        return this.http.get<Account[]>(this.API, { headers: this.getAuthHeaders() });
    }
    getAccountByUserId(userId: number): Observable<Account> {
        return this.http.get<Account>(`${this.API}?userId=${userId}`, { headers: this.getAuthHeaders() });
    }
    createAccount(account: Account): Observable<Account> {
        return this.http.post<Account>(this.API, account, { headers: this.getAuthHeaders() });
    }
    updateAccount(account: Account): Observable<Account> {
        return this.http.put<Account>(`${this.API}/${account.id}`, account, { headers: this.getAuthHeaders() });
    }
}
