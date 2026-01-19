import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Order {
    id: number;
    buyer: number;
    merchant: number;
    orderDate: string;
    status: string;
    items: number[];
    totalAmount: number;
    deliveryAddress: string;
    expectedDeliveryDate: string;
    deliveryInstructions: string;
    paid: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Transaction {
    id: number;
    account: any;
    type: 'CREDIT' | 'WITHDRAWAL' | 'TRANSFER';
    amount: number;
    status: 'COMPLETED' | 'PENDING' | 'REFUNDED';
    description: string;
    transactionDate: string;
    createdAt: string;
    updatedAt: string;
    order: Order;
}

@Injectable({ providedIn: 'root' })
export class TransactionService {
    private readonly API = environment.apiUrl + 'transactions';

    constructor(private http: HttpClient) { }

    getTransactions(): Observable<Transaction[]> {
        return this.http.get<Transaction[]>(this.API);
    }

    getRecentTransactions(limit: number = 5): Observable<Transaction[]> {
        return this.http.get<Transaction[]>(`${this.API}?limit=${limit}`);
    }
    addTransaction(transaction: { type: string, amount: number, description: string }): Observable<Transaction> {
        return this.http.post<Transaction>(this.API, transaction);
    }
}