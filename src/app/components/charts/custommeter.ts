import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeterGroupModule } from 'primeng/metergroup';
import { trackByFn } from '@/lib/utils';

@Component({
    selector: 'custom-meter',
    standalone: true,
    imports: [CommonModule, MeterGroupModule],
    template: `<div *ngIf="title()" class="mb-2 body-xsmall text-left">{{ title() }}</div>
        <p-meter-group [value]="processData()" labelPosition="end">
            <ng-template #label let-value>
                <div class="flex flex-nowrap">
                    @for (val of value; track trackByFn()) {
                        <div [style]="{ width: val.value + '%' }" class="flex flex-col gap-1 !min-w-[25%] w-fit">
                            <span class="body-xsmall text-left">{{ val.label }}</span>
                            <span class="label-small text-left text-surface-950 dark:text-surface-0">{{ val.title }}</span>
                        </div>
                    }
                </div>
            </ng-template>
            <ng-template #meter let-value let-styleClass="class" let-size="size">
                <span [ngClass]="[styleClass, value.colorClass]" class="!rounded-full !min-w-[25%] w-fit" [ngStyle]="{ background: value.colorClass ? '' : value.color, width: size }"></span>
            </ng-template>
        </p-meter-group>`
})
export class CustomMeter {
    title = input<string>('');

    value = input<any[]>([]);

    processData = computed<any>(() => {
        if (this.value() && this.value().length > 0) {
            const total = this.value().reduce((acc, item) => acc + item.value, 0);
            return this.value().map((item) => ({
                ...item,
                value: (item.value / total) * 100
            }));
        }
        return null;
    });
    protected readonly trackByFn = trackByFn;
}
