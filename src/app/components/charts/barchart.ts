import { Component, computed, effect, HostBinding, inject, input } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { LayoutService } from '@/layout/service/layout.service';
import { sampleDataByFixedLength } from '@/lib/utils';
import 'chartjs-adapter-date-fns';

@Component({
    selector: 'bar-chart',
    standalone: true,
    imports: [CommonModule, ChartModule],
    template: `<p-chart type="bar" [data]="chartData" [plugins]="plugins" [options]="chartOptions" style="height:100%; display: block" /> `,
    host: {
        class: 'h-full w-full cursor-pointer min-w-[640px] max-h-80'
    },
    styles: `
        :host ::ng-deep {
            p-chart > div {
                height: 100%;
                canvas {
                    height: 100%;
                }
            }
        }
    `
})
export class BarChart {
    @HostBinding('class') get styleClass() {
        return this.class();
    }

    layoutService = inject(LayoutService);

    class = input<string>('');

    labels = input<string[]>(['']);

    datasets = input<any[]>([]);

    show = input<number>(12);

    tooltipPrefix = input<string>('$');

    option = input<string>('month');

    bgColors = input<string[]>();

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());

    data: any;

    plugins = [];

    chartData: any;

    chartOptions: any;

    chartColors: any;

    constructor() {
        effect(() => {
            this.isDarkTheme();
            this.drawChart();
        });

        effect(() => {
            this.datasets();
            this.drawChart();
        });
    }

    ngOnInit() {
        this.drawChart();
    }

    drawChart() {
        this.setChartColors();
        this.chartData = this.setChartData(this.option());
        this.chartOptions = this.setChartOptions(this.tooltipPrefix());
    }

    setChartColors() {
        const rootStyles = getComputedStyle(document.documentElement);
        this.chartColors = {
            surface100: rootStyles.getPropertyValue('--p-surface-100'),
            surface200: rootStyles.getPropertyValue('--p-surface-200'),
            surface400: rootStyles.getPropertyValue('--p-surface-400'),
            surface500: rootStyles.getPropertyValue('--p-surface-500'),
            surface700: rootStyles.getPropertyValue('--p-surface-700'),
            surface900: rootStyles.getPropertyValue('--p-surface-900')
        };
    }

    setChartData(option: string) {
        const sampledData: any = sampleDataByFixedLength(this.datasets(), option, this.show());
        if (sampledData.length <= 0) {
            this.data = [];
            return;
        }
        const rootStyles = getComputedStyle(document.documentElement);
        const surface200 = rootStyles.getPropertyValue('--p-surface-200');
        const surface300 = rootStyles.getPropertyValue('--p-surface-300');
        const surface400 = rootStyles.getPropertyValue('--p-surface-400');
        const surface500 = rootStyles.getPropertyValue('--p-surface-500');
        const surface600 = rootStyles.getPropertyValue('--p-surface-600');

        const lineCount = sampledData[0].y.length;
        const dataArr = Array(lineCount)
            .fill(null)
            .map((_, index) => {
                return {
                    label: this.labels()[index] ?? 'dataset' + index,
                    data: [] as { x: Date; y: any }[],
                    fill: true,
                    backgroundColor: [surface400, surface300, surface200][index] || surface400,
                    hoverBackgroundColor: [surface600, surface500, surface400][index] || surface600,
                    hideInLegendAndTooltip: false,
                    barThickness: 28,
                    borderRadius:
                        index !== lineCount - 1
                            ? 0
                            : {
                                  topLeft: 8,
                                  topRight: 8,
                                  bottomLeft: 0,
                                  bottomRight: 0
                              }
                };
            });
        //@ts-ignore
        sampledData.forEach(({ x, y }) => {
            Array(lineCount)
                .fill(null)
                .forEach((_, i) => {
                    let a = [];
                    a.push({ x, y: y[i] });
                    dataArr[i].data = [...dataArr[i].data, ...a];
                });
        });
        this.data = dataArr;

        if (sampledData[sampledData.length - 1].x === undefined) {
            const lastValidDate = sampledData[sampledData.length - 2].x;
            const interval = this.getIntervalFromOption(option);
            sampledData[sampledData.length - 1].x = this.addInterval(lastValidDate, interval);
        }

        return {
            datasets: dataArr
        };
    }

    getIntervalFromOption(option: string) {
        switch (option) {
            case 'week':
                return { weeks: 1 };
            case 'month':
                return { months: 1 };
            case 'quarter':
                return { months: 3 };
            case 'year':
                return { years: 1 };
            default:
                return { days: 1 };
        }
    }

    addInterval(date: Date, interval: any) {
        return new Date(date.getFullYear() + (interval.years || 0), date.getMonth() + (interval.months || 0), date.getDate() + (interval.days || 0) + (interval.weeks ? interval.weeks * 7 : 0));
    }

    setChartOptions(tooltipPrefix: string) {
        const rootStyles = getComputedStyle(document.documentElement);
        const surface100 = rootStyles.getPropertyValue('--p-surface-100');
        const surface400 = rootStyles.getPropertyValue('--p-surface-400');
        const surface500 = rootStyles.getPropertyValue('--p-surface-500');
        const surface900 = rootStyles.getPropertyValue('--p-surface-900');

        const endDate = new Date(this.data[this.data.length - 1].x);
        const startDate = new Date(this.data[0].x);
        return {
            interaction: {
                intersect: false,
                mode: 'index'
            },
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: 0
            },
            plugins: {
                tooltip: {
                    enabled: false,
                    position: 'nearest',
                    external: function (context: any) {
                        const { chart, tooltip } = context;
                        let tooltipEl = chart.canvas.parentNode.querySelector('div.chartjs-tooltip');
                        if (!tooltipEl) {
                            tooltipEl = document.createElement('div');
                            tooltipEl.classList.add(
                                'chartjs-tooltip',
                                'dark:bg-surface-950',
                                'bg-surface-0',
                                'rounded-[8px]',
                                'overflow-hidden',
                                'opacity-100',
                                'border',
                                'border-surface',
                                'absolute',
                                'transition-all',
                                'duration-[0.05s]',
                                'pointer-events-none',
                                'shadow-[0px_16px_32px_-12px_rgba(88,92,95,0.10)]'
                            );
                            chart.canvas.parentNode.appendChild(tooltipEl);
                        }

                        if (tooltip.opacity === 0) {
                            tooltipEl.style.opacity = 0;
                            return;
                        }
                        const datasetPointsX = tooltip.dataPoints.map((dp: any) => dp.element.x);
                        const avgX = datasetPointsX.reduce((a: any, b: any) => a + b, 0) / datasetPointsX.length;
                        const avgY = tooltip.dataPoints[2].element.y;

                        if (tooltip.body) {
                            tooltipEl.innerHTML = '';
                            const tooltipHeader = document.createElement('div');
                            tooltipHeader.classList.add('bg-surface-100', 'dark:bg-surface-900', 'px-3', 'py-2.5', 'border-b', 'border-surface', 'text-left', 'label-xsmall');
                            tooltipHeader.appendChild(document.createTextNode(tooltip.title[0]));
                            tooltipEl.appendChild(tooltipHeader);
                            const tooltipBody = document.createElement('div');
                            tooltipBody.classList.add('flex', 'flex-col', 'gap-2', 'px-3', 'py-2', 'min-w-[12.5rem]');
                            tooltip.dataPoints.reverse().forEach((body: any) => {
                                const row = document.createElement('div');
                                row.classList.add('flex', 'items-center', 'gap-2', 'w-full');
                                const point = document.createElement('div');
                                point.classList.add('w-2.5', 'h-2.5', 'rounded-full');
                                point.style.backgroundColor = body.dataset.backgroundColor;
                                row.appendChild(point);
                                const label = document.createElement('span');
                                label.appendChild(document.createTextNode(body.dataset.label));
                                label.classList.add('paragraph-xsmall', 'text-base', 'text-surface-950', 'dark:text-surface-0', 'flex-1', 'text-left', 'capitalize');
                                row.appendChild(label);
                                const value = document.createElement('span');
                                value.appendChild(document.createTextNode(tooltipPrefix + body.formattedValue));
                                value.classList.add('paragraph-xsmall', 'text-base', 'text-surface-950', 'dark:text-surface-0', 'text-right');
                                row.appendChild(value);
                                tooltipBody.appendChild(row);
                            });
                            tooltipEl.appendChild(tooltipBody);
                        }

                        const { offsetLeft: positionX } = chart.canvas;

                        tooltipEl.style.opacity = 1;
                        tooltipEl.style.font = tooltip.options.bodyFont.string;
                        tooltipEl.style.padding = 0;
                        const chartWidth = chart.width;
                        const tooltipWidth = tooltipEl.offsetWidth;
                        const chartHeight = chart.height;
                        const tooltipHeight = tooltipEl.offsetHeight;

                        let tooltipX = positionX + avgX + 20;
                        let tooltipY = avgY;

                        if (tooltipX + tooltipWidth > chartWidth) {
                            tooltipX = positionX + avgX - tooltipWidth - 20;
                        }

                        if (tooltipY < 0) {
                            tooltipY = 0;
                        } else if (tooltipY + tooltipHeight > chartHeight) {
                            tooltipY = chartHeight - tooltipHeight;
                        }

                        tooltipEl.style.left = tooltipX + 'px';
                        tooltipEl.style.top = tooltipY + 'px';
                    }
                },
                legend: {
                    display: false
                },
                title: {
                    display: false
                }
            },
            scales: {
                x: {
                    stacked: true,
                    type: 'time',
                    time: {
                        unit: this.option(),
                        tooltipFormat: 'MM/dd/yyyy HH:mm',
                        displayFormats: {
                            week: 'MMM d, yyyy',
                            month: 'MMM yyyy',
                            quarter: 'QQQ yyyy',
                            year: 'yyyy'
                        }
                    },
                    min: startDate,
                    max: endDate,
                    offset: true,
                    grid: {
                        display: false,
                        color: this.isDarkTheme() ? surface900 : surface100
                    },
                    ticks: {
                        color: this.isDarkTheme() ? surface500 : surface400,
                        autoSkip: true,
                        maxRotation: 0,
                        source: 'data'
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    display: true,
                    stacked: true,
                    min: 0,
                    grid: {
                        display: true,
                        color: this.isDarkTheme() ? surface900 : surface100
                    },
                    border: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 6,
                        color: this.isDarkTheme() ? surface500 : surface400
                    }
                }
            }
        };
    }
}
