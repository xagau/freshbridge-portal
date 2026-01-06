import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Address {
    street?: string;
    address?: string; // Full address string
    city?: string;
    state?: string;
    zipCode?: string;
    postalCode?: string;
    country?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AddressService {
    private addressSubject = new BehaviorSubject<Address | null>(this.getStoredAddress());
    public address$: Observable<Address | null> = this.addressSubject.asObservable();

    private readonly STORAGE_KEY = 'user_address';

    /**
     * Get the current address
     */
    getAddress(): Address | null {
        return this.addressSubject.value;
    }

    /**
     * Save address to service and localStorage
     */
    saveAddress(address: Address): void {
        // Store in localStorage
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(address));
        // Update subject
        this.addressSubject.next(address);
    }

    /**
     * Get address from localStorage
     */
    private getStoredAddress(): Address | null {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Error reading address from localStorage:', error);
            return null;
        }
    }

    /**
     * Clear stored address
     */
    clearAddress(): void {
        localStorage.removeItem(this.STORAGE_KEY);
        this.addressSubject.next(null);
    }

    /**
     * Update partial address fields
     */
    updateAddress(partialAddress: Partial<Address>): void {
        const currentAddress = this.getAddress() || {};
        const updatedAddress = { ...currentAddress, ...partialAddress };
        this.saveAddress(updatedAddress);
    }
}

