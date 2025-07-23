import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { trackByFn } from '@/lib/utils';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'orders-widget',
    standalone: true,
    imports: [CommonModule, ButtonModule, TagModule, DividerModule, CardModule],
    template: ` 
        <p-card header="Hot Buys">
            @for (item of orders; track trackByFn(); let idx = $index) {
                <div class="flex items-center gap-2">
                    <img class="w-4 h-4 dark:border-surface-800" [src]="item.image" [alt]="item.product" />
                    <div class="flex-1">
                        <div class="label-small text-left text-surface-950 dark:text-surface-0">{{ item.farm }}</div>
                        <div class="text-xs text-surface-500">{{ item.product }}</div>
                    </div>
                    <div class="flex flex-col items-end">
                        <p-tag [value]="item.price" />
                        <span class="mt-1 body-xsmall">{{ item.weight }}</span>
                    </div>
                </div>
                <p-divider *ngIf="idx < orders.length - 1" class="my-3.5" />
            }
        </p-card>`,
    styles: [`
        img {
            object-fit: cover;
            border-radius: 4px;
            min-width: 32px;
            min-height: 32px;
        }
    `]
})
export class OrdersWidget {
   orders = [
    { 
        farm: "Corn", 
        product: "Sweet Corn", 
        image: 'https://img.freepik.com/free-photo/yellow-corn-cobs-white-background_93675-80845.jpg', 
        price: '$13', 
        weight: '250 lbs' 
    },
    { 
        farm: "Tomatoes", 
        product: "Vine Tomatoes", 
        image: 'https://img.freepik.com/free-photo/ripe-red-tomatoes_2829-18941.jpg', 
        price: '$22', 
        weight: '180 lbs' 
    },
    { 
        farm: "Lettuce", 
        product: "Romaine Hearts", 
        image: 'https://img.freepik.com/free-photo/fresh-green-lettuce-leaves_2829-8129.jpg', 
        price: '$56', 
        weight: '120 lbs' 
    },
    { 
        farm: "Apples", 
        product: "Gala Apples", 
        image: 'https://img.freepik.com/free-photo/red-apple-with-leaf-isolated-white_93675-127983.jpg', 
        price: '$20', 
        weight: '50 bushels' 
    },
    { 
        farm: "Onions", 
        product: "White Onions", 
        image: 'https://img.freepik.com/free-photo/white-onions-isolated-white-surface_93675-130241.jpg', 
        price: '$18', 
        weight: '30 lbs' 
    },
];

    protected readonly trackByFn = trackByFn;
}