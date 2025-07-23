import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'statusColor' })
export class StatusColorPipe implements PipeTransform {
    transform(status: string): string {
        switch (status) {
            case 'PENDING':
                return 'secondary';
            case 'ACCEPTED':
                return 'info';
            case 'PREPARING':
                return 'warning';
            case 'READY_FOR_PICKUP':
                return 'help';
            case 'DELIVERED':
                return 'success';
            case 'COMPLETED':
                return 'success';
            case 'REJECTED':
            case 'CANCELLED':
                return 'danger';
            default:
                return 'secondary';
        }
    }
}
