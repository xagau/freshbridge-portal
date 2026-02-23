import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats a phone number consistently for any country.
 * NANP (US/Canada, country code 1): +1 XXX XXX XXXX
 * Other countries: groups from right in 3s, e.g. +44 791 112 345 6
 */
@Pipe({
    name: 'phone',
    standalone: true
})
export class PhonePipe implements PipeTransform {
    transform(value: string | null | undefined): string {
        if (value == null || value === '') return '';
        const digits = value.replace(/\D/g, '');
        if (digits.length === 0) return value.trim();

        // NANP (US/Canada): +1 then area 3, exchange 3, subscriber 4 → +1 416 878 5282
        if (digits.startsWith('1') && digits.length === 11) {
            return `+1 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
        }
        if (digits.length === 10 && !digits.startsWith('0')) {
            return `+1 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
        }

        // Other countries: group from right in 3s
        const fromRight: string[] = [];
        let i = digits.length;
        while (i > 0) {
            const chunkSize = i >= 3 ? 3 : i;
            fromRight.unshift(digits.slice(i - chunkSize, i));
            i -= chunkSize;
        }
        return '+' + fromRight.join(' ');
    }
}
