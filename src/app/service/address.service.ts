import { Injectable } from '@angular/core';

export interface Address {
    street?: string;
    address?: string; // Full address string
    city?: string;
    state?: string;
    zipCode?: string;
    postalCode?: string;
    country?: string;
}

export interface AddressSearchResult {
    display_name: string;
    address?: {
        state?: string;
        state_district?: string;
        region?: string;
        city?: string;
        town?: string;
        village?: string;
        postcode?: string;
        country?: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class AddressService {
    private readonly nominatimEndpoint = 'https://nominatim.openstreetmap.org/search';
    private nominatimAbortController?: AbortController;

    /**
     * Search addresses via OSM Nominatim
     */
    async searchAddress(query: string, limit: number = 5): Promise<AddressSearchResult[]> {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            return [];
        }

        if (this.nominatimAbortController) {
            this.nominatimAbortController.abort();
        }

        this.nominatimAbortController = new AbortController();
        const url = `${this.nominatimEndpoint}?format=json&addressdetails=1&limit=${limit}&q=${encodeURIComponent(trimmedQuery)}`;

        try {
            const response = await fetch(url, {
                signal: this.nominatimAbortController.signal,
                headers: {
                    Accept: 'application/json'
                }
            });

            if (!response.ok) {
                return [];
            }

            const results = (await response.json()) as AddressSearchResult[];
            return results || [];
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                return [];
            }
            return [];
        }
    }

    extractState(result?: AddressSearchResult): string {
        return result?.address?.state || result?.address?.state_district || result?.address?.region || '';
    }

    extractCity(result?: AddressSearchResult): string {
        return result?.address?.city || result?.address?.town || result?.address?.village || '';
    }

    extractPostalCode(result?: AddressSearchResult): string {
        return result?.address?.postcode || '';
    }

    extractCountry(result?: AddressSearchResult): string {
        return result?.address?.country || '';
    }
}

