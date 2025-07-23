import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { StatusColorPipe } from '@/shared/pipes/status-color.pipe';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-order-details-modal',
    templateUrl: './order-details-modal.component.html',
    imports: [CommonModule, ButtonModule, DialogModule, StatusColorPipe, TagModule],
})
export class OrderDetailsModalComponent {
    @Input() order: any;
    @Output() closed = new EventEmitter<void>();

    bgColors = ['var(--p-primary-color)'];
    close() {
        this.closed.emit();
    }

    getSubtotal(order: any) {
        return order.items.reduce((sum: number, item: any) => sum + item.subtotal, 0).toFixed(2);
    }

    getTax(order: any) {
        // Example: 13% tax
        return (this.getSubtotal(order) * 0.13).toFixed(2);
    }
}
