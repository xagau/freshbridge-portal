import { Component } from '@angular/core';
import { BarChart } from '@/components/charts/barchart';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { generateRandomMultiData } from '@/lib/utils';

@Component({
    selector: 'overview-widget',
    standalone: true,
    imports: [CommonModule, SelectModule, FormsModule, BarChart],
    template: `<div class="flex items-start justify-between gap-2 mb-4">
            <div>
                <h3 class="label-medium">E-Commerce Overview</h3>
                <span class="body-xsmall">Trends summary, performance analysis </span>
            </div>
            <p-select [(ngModel)]="selectedRange" [options]="ranges" optionLabel="name" placeholder="Select a Month" styleClass="w-24" />
        </div>
        <div class="flex-1 w-full h-full overflow-hidden">
            <bar-chart [labels]="labels" [datasets]="randomData" [bgColors]="bgColors" [option]="selectedRange.unit" class="min-w-[640px] flex-1 h-full w-full cursor-pointer" />
        </div>`,
    host: {
        class: 'card !mb-0 h-96 min-w-80 flex flex-col p-6 border border-surface rounded-2xl overflow-hidden'
    },
    styles: `
        :host ::ng-deep {
            .p-select {
                padding-right: 0.375rem;
                border-radius: 0.5rem;

                .p-select-label {
                    padding: 0.25rem 0.25rem 0.25rem 0.5rem;
                    font-weight: 500;
                    font-size: 0.875rem;
                    color: var(--text-surface-950);
                }

                .p-select-dropdown {
                    width: 0.75rem;

                    .p-select-dropdown-icon {
                        width: 0.75rem;
                        color: var(--text-surface-950);
                    }
                }

                .p-select-option {
                    padding: 0.25rem 0.5rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                }
            }

            html.app-dark {
                .p-select {
                    .p-select-label {
                        color: var(--text-surface-0);
                    }

                    .p-select-dropdown-icon {
                        color: var(--text-surface-0);
                    }
                }
            }
        }
    `
})
export class OverviewWidget {
    labels = ['Fashion', 'Electronics', 'Home'];

    bgColors = ['rgba(151,163,182,1)', 'rgba(205,213,224,1)', 'rgba(227,232,239,1)'];

    randomData = generateRandomMultiData('2020-10-27T00:00:00', '2023-11-03T00:00:00', 4, 10, 150, 3);

    ranges = [
        { name: 'Weekly', unit: 'week' },
        { name: 'Monthly', unit: 'month' },
        { name: 'Quarter', unit: 'quarter' },
        { name: 'Yearly', unit: 'year' }
    ];

    selectedRange = this.ranges[0];
}
