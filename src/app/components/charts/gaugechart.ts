import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { LayoutService } from '@/layout/service/layout.service';

@Component({
    selector: 'gauge-chart',
    standalone: true,
    imports: [CommonModule, ChartModule],
    template: `<div [ngClass]="class()" class="relative min-h-56 flex items-center justify-center">
        <!-- <p-chart type="doughnut" [data]="chartData" [options]="chartOptions" class="h-auto relative z-50 mx-auto cursor-pointer" /> -->
        <div class="absolute h-full top-[3.75rem] left-1/2 -translate-x-1/2" [ngStyle]="{ width: chartDim().width - 55 + 'px' }">
            <svg class="w-full h-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 238 120" fill="none">
                <path
                    d="M235 120C235 88.9697 222.779 59.2103 201.024 37.2685C179.27 15.3268 149.765 3 119 3C88.2349 3 58.7298 15.3267 36.9756 37.2685C15.2214 59.2103 3 88.9697 3 120"
                    class="stroke-surface-200 dark:stroke-surface-800"
                    stroke-width="6"
                    stroke-dasharray="0.7 4"
                />
            </svg>
        </div>
        <div class="absolute z-20 text-surface-950 top-0 left-1/2 -translate-x-1/2 flex flex-col items-center justify-end transition-all p-5" [style]="{ width: chartDim().width + 'px', height: chartDim().height + 'px' }">
            <span class="title-h3">&#36;{{ data()[0] }}</span>
            <span class="body-medium -mt-1">{{ labels()[0] }}</span>
        </div>
    </div>`
})
export class GaugeChart {
    layoutService = inject(LayoutService);

    class = input<string>('');

    data = input<number[]>([80, 20]);

    labels = input<string[]>(['Score', 'Gray Area']);

    chartData: any;

    chartOptions: any;

    chartDim = signal<any>({ width: '100%', height: '100%' });

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());

    constructor() {
        effect(() => {
            this.isDarkTheme();
            this.drawChart();
        });
    }

    drawChart() {
        this.chartData = this.setChartData();
        this.chartOptions = this.setChartOptions();
    }

    setChartData() {
        const rootStyles = getComputedStyle(document.documentElement);
        const surface200Color = rootStyles.getPropertyValue('--p-surface-200');
        const surface800Color = rootStyles.getPropertyValue('--p-surface-800');

        return {
            labels: this.labels(),
            datasets: [
                {
                    label: '',
                    data: this.data(),
                    backgroundColor: (context: any) => {
                        if (!context.chart.chartArea) {
                            return;
                        }
                        const {
                            ctx,
                            chartArea: { width, height }
                        } = context.chart;
                        const gradientBg = ctx.createLinearGradient(0, 0, width, 0);
                        gradientBg.addColorStop(0, 'rgba(220, 38, 38, 1)');
                        gradientBg.addColorStop(0.5, 'rgba(250, 204, 21, 1)');
                        gradientBg.addColorStop(1, 'rgba(34, 197, 94, 1)');

                        return [gradientBg, this.isDarkTheme() ? surface800Color : surface200Color];
                    },
                    borderWidth: 0,
                    borderRadius: 99,
                    cutout: '88%',
                    circumference: 180,
                    rotation: 270
                }
            ]
        };
    }

    setChartOptions() {
        return {
            aspectRatio: 1.5,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        };
    }
}
