import { Component, computed, effect, HostBinding, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '@/layout/service/layout.service';
import { ChartModule } from 'primeng/chart';
import { sampleDataReduction } from '@/lib/utils';
import 'chartjs-adapter-date-fns';

@Component({
    selector: 'line-chart',
    standalone: true,
    imports: [CommonModule, ChartModule],
    template: `<p-chart type="line" [data]="chartData" [plugins]="plugins" [options]="chartOptions" />`,
    host: {
        class: 'h-full w-full cursor-pointer'
    }
})
export class LineChart {
    @HostBinding('class') get styleClass() {
        return this.class();
    }

    layoutService = inject(LayoutService);

    class = input<string>('');

    labels = input<string[]>([]);

    datasets = input<any[]>([]);

    bgColor = input<any[] | undefined | null>();

    borderColor = input<string | undefined | null>();

    show = input<number>(6);

    tooltipPrefix = input<string>('');

    option = input<string | undefined>('month');

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());

    data: any;

    plugins: any;

    chartData: any;

    chartOptions: any;

    constructor() {
        effect(() => {
            this.isDarkTheme();
            this.drawChart();
        });

        effect(() => {
            this.option();
            this.drawChart();
        });
    }

    drawChart() {
        const sampleData = sampleDataReduction(this.datasets(), <string>this.option(), this.show());
        this.data = sampleData;
        this.chartData = this.setChartData();
        this.chartOptions = this.setChartOptions(this.tooltipPrefix());
        this.plugins = this.setChartPlugins();
    }

    setChartPlugins() {
        if (!this.data) {
            return;
        }
        const hoverLine = {
            id: 'hoverLine',
            afterDatasetsDraw: (chart: any) => {
                const {
                    ctx,
                    tooltip,
                    chartArea: { bottom },
                    scales: { x, y }
                } = chart;
                if (tooltip._active.length > 0) {
                    const xCoor = x.getPixelForValue(tooltip.dataPoints[0].raw.x);
                    const yCoor = y.getPixelForValue(tooltip.dataPoints[0].parsed.y);
                    ctx.save();
                    ctx.beginPath();
                    ctx.lineWidth = 1.2;
                    const rootStyles = getComputedStyle(document.documentElement);
                    const surface0Color = rootStyles.getPropertyValue('--p-surface-0');
                    const surface950Color = rootStyles.getPropertyValue('--p-surface-950');
                    ctx.strokeStyle = this.borderColor() ?? (this.isDarkTheme() ? surface0Color : surface950Color);
                    ctx.setLineDash([4, 2]);
                    ctx.moveTo(xCoor, yCoor);
                    ctx.lineTo(xCoor, bottom + 8);
                    ctx.stroke();
                    ctx.closePath();
                    ctx.restore();
                }
            }
        };

        return [hoverLine];
    }

    setChartData() {
        const rootStyles = getComputedStyle(document.documentElement);
        const surface0Color = rootStyles.getPropertyValue('--p-surface-0');
        const surface950Color = rootStyles.getPropertyValue('--p-surface-950');
        return {
            datasets: [
                {
                    label: 'My Dataset',
                    data: this.data,
                    fill: true,
                    borderColor: this.borderColor() ?? (this.isDarkTheme() ? '#FAFAFA' : '#030616'),
                    tension: 0.3,
                    borderWidth: 1.2,
                    pointBorderColor: 'rgba(0, 0, 0, 0)',
                    pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                    pointHoverBackgroundColor: this.borderColor() ?? (this.isDarkTheme() ? surface0Color : surface950Color),
                    pointHoverBorderColor: this.isDarkTheme() ? surface950Color : surface0Color,
                    pointBorderWidth: 8,
                    hideInLegendAndTooltip: false,
                    pointStyle: 'circle',
                    pointRadius: 4,
                    backgroundColor: (context: any) => {
                        const defaultColor = [this.isDarkTheme() ? 'rgba(255, 255, 255, 0.24)' : 'rgba(3, 6, 22, 0.12)', this.isDarkTheme() ? 'rgba(255, 255, 255, 0)' : 'rgba(3, 6, 22, 0)'];
                        const bg = this.bgColor() ?? defaultColor;

                        if (!context.chart.chartArea) {
                            return;
                        }

                        const {
                            ctx,
                            chartArea: { top, bottom }
                        } = context.chart;
                        const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
                        const colorTranches = 1 / (bg.length - 1);

                        bg.forEach((color, index) => {
                            gradientBg.addColorStop(index * colorTranches, color);
                        });

                        return gradientBg;
                    }
                }
            ]
        };
    }

    setChartOptions(tooltipPrefix: string) {
        const rootStyles = getComputedStyle(document.documentElement);
        const surface400Color = rootStyles.getPropertyValue('--p-surface-400');
        const surface500Color = rootStyles.getPropertyValue('--p-surface-500');
        const surface200Color = rootStyles.getPropertyValue('--p-surface-200');
        const surface800Color = rootStyles.getPropertyValue('--p-surface-800');

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
                                'label-small',
                                'px-2',
                                'py-1',
                                'dark:bg-surface-950',
                                'bg-surface-0',
                                'rounded-[8px]',
                                'opacity-100',
                                'flex',
                                'items-center',
                                'justify-center',
                                'border',
                                'border-surface',
                                'pointer-events-none',
                                'absolute',
                                '-translate-x-1/2',
                                'transition-all',
                                'duration-[0.05s]',
                                'shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)]'
                            );
                            chart.canvas.parentNode.appendChild(tooltipEl);
                        }

                        if (tooltip.opacity === 0) {
                            tooltipEl.style.opacity = 0;
                            return;
                        }

                        if (tooltip.body) {
                            const bodyLines = tooltip.body.map((b: any) => {
                                const strArr = b.lines[0].split(':');
                                return {
                                    text: strArr[0].trim(),
                                    value: strArr[1].trim()
                                };
                            });

                            tooltipEl.innerHTML = '';
                            bodyLines.forEach((body: any) => {
                                const text = document.createElement('div');
                                text.appendChild(document.createTextNode(tooltipPrefix + body.value));
                                text.classList.add('label-small', 'text-surface-950', 'dark:text-surface-0', 'font-medium');
                                text.style.fontSize = '14px';
                                tooltipEl.appendChild(text);
                            });
                        }

                        const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

                        tooltipEl.style.opacity = 1;
                        tooltipEl.style.left = positionX + tooltip.caretX + 'px';
                        tooltipEl.style.top = positionY + tooltip.caretY - 45 + 'px';
                    }
                },
                legend: {
                    display: false
                },
                title: {
                    display: false
                },
                decimation: {
                    enabled: true,
                    algorithm: 'lttb',
                    samples: 100,
                    threshold: 40
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: this.option(),
                        tooltipFormat: 'MM/dd/yyyy HH:mm'
                    },
                    min: startDate,
                    max: endDate,
                    offset: false,
                    grid: {
                        display: true,
                        lineWidth: 1.2,
                        color: this.isDarkTheme() ? surface800Color : surface200Color
                    },
                    ticks: {
                        color: this.isDarkTheme() ? surface500Color : surface400Color,
                        padding: 2,
                        autoSkip: false,
                        maxRotation: 0,
                        source: 'auto'
                    },
                    border: {
                        display: false,
                        dash: [4, 2]
                    }
                },
                y: {
                    beginAtZero: true,
                    display: false,
                    min: 0
                }
            }
        };
    }
}
