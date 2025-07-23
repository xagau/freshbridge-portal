import { Component, computed, effect, HostBinding, inject, input, untracked } from '@angular/core';
import { LayoutService } from '@/layout/service/layout.service';
import { sampleDataReductionByArray } from '@/lib/utils';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import 'chartjs-adapter-date-fns';

@Component({
    selector: 'multi-line-chart',
    standalone: true,
    imports: [CommonModule, ChartModule],
    template: `<p-chart type="line" [data]="chartData" [plugins]="plugins" [options]="chartOptions" />`,
    host: {
        class: '!max-h-80 min-h-72 min-w-[640px] w-full overflow-auto h-full cursor-pointer'
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
export class MultiLineChart {
    @HostBinding('class') get styleClass() {
        return this.class();
    }

    layoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());

    class = input<string>('');

    labels = input<string[]>([]);

    datasets = input<any[]>([]);

    bgColors = input<(string | string[])[] | undefined | null | any>();

    borderColors = input<(string | string[])[] | undefined | null | any>();

    show = input<number>(12);

    tooltipPrefix = input<string>('$');

    option = input<string>('month');

    data: any;

    plugins: any;

    chartData: any;

    chartOptions: any;

    constructor() {
        effect(() => {
            this.option();
            this.isDarkTheme();
            this.drawChart();

            untracked(() => this.tooltipPrefix());
        });
    }

    drawChart() {
        this.chartData = this.setChartData(this.option());
        this.chartOptions = this.setChartOptions(this.tooltipPrefix());
        this.plugins = this.setChartPlugins();
    }

    setChartData(option: string) {
        const sampledData = sampleDataReductionByArray(this.datasets(), option, this.show());
        if (sampledData.length <= 0) {
            this.data = [];

            return {
                datasets: null
            };
        }
        const darkMode = this.isDarkTheme() ?? false;
        const rootStyles = getComputedStyle(document.documentElement);
        const surface0Color = rootStyles.getPropertyValue('--p-surface-0');
        const surface950Color = rootStyles.getPropertyValue('--p-surface-950');

        const lineCount = sampledData[0].y.length;
        const dataArr: any = Array(lineCount)
            .fill(null)
            .map((_, index) => {
                return {
                    label: this.labels()[index] ?? 'dataset' + index,
                    data: [],
                    fill: true,
                    borderColor: this.borderColors()?.[index] ?? (darkMode ? '#FAFAFA' : '#030616'),
                    tension: 0.3,
                    borderWidth: 1.2,
                    pointBorderColor: 'rgba(0, 0, 0, 0)',
                    pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                    pointHoverBackgroundColor: this.borderColors()?.[index] ?? (darkMode ? surface0Color : surface950Color),
                    pointHoverBorderColor: darkMode ? surface950Color : surface0Color,
                    pointBorderWidth: 12,
                    hideInLegendAndTooltip: false,
                    pointStyle: 'circle',
                    pointRadius: 4,
                    backgroundColor: (context: any) => {
                        const defaultColor = [darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(3, 6, 22, 0.06)', darkMode ? 'rgba(255, 255, 255, 0)' : 'rgba(3, 6, 22, 0)'];
                        const bg = this.bgColors()?.[index] !== undefined ? this.bgColors()![index] : defaultColor;

                        if (!context.chart.chartArea) {
                            return;
                        }

                        const {
                            ctx,
                            chartArea: { top, bottom }
                        } = context.chart;
                        const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
                        const colorTranches = 1 / (bg.length - 1);

                        for (let i = 0; i < bg.length; i++) {
                            gradientBg.addColorStop(0 + i * colorTranches, bg[i]);
                        }

                        return gradientBg;
                    }
                };
            });
        sampledData.forEach(({ x, y }) => {
            Array(lineCount)
                .fill(null)
                .forEach((_, i) => {
                    dataArr[i].data.push({ x, y: y[i] });
                });
        });
        this.data = dataArr;
        return {
            datasets: dataArr
        };
    }

    setChartPlugins() {
        const hoverLine = {
            id: 'hoverLine',
            beforeDatasetsDraw: (chart: any) => {
                const {
                    ctx,
                    tooltip,
                    chartArea: { bottom },
                    scales: { x }
                } = chart;
                if (tooltip._active.length > 0) {
                    const xCoor = x.getPixelForValue(tooltip.dataPoints[0].raw.x);
                    ctx.save();
                    ctx.beginPath();
                    ctx.lineWidth = 1.2;
                    const rootStyles = getComputedStyle(document.documentElement);
                    const surface500Color = rootStyles.getPropertyValue('--p-surface-500');
                    ctx.strokeStyle = surface500Color;
                    ctx.setLineDash([4, 4]);
                    ctx.moveTo(xCoor, 0);
                    ctx.lineTo(xCoor, bottom + 8);
                    ctx.stroke();
                    ctx.closePath();
                    ctx.restore();
                }
            }
        };

        return [hoverLine];
    }

    setChartOptions(tooltipPrefix: string) {
        const darkMode = this.isDarkTheme() ?? false;
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

                        const datasetPointsY = tooltip.dataPoints.map((dp: any) => dp.element.y);
                        const avgY = datasetPointsY.reduce((a: any, b: any) => a + b, 0) / datasetPointsY.length;

                        if (tooltip.body) {
                            tooltipEl.innerHTML = '';
                            const tooltipHeader = document.createElement('div');
                            tooltipHeader.classList.add('bg-surface-100', 'dark:bg-surface-900', 'px-3', 'py-2.5', 'border-b', 'border-surface', 'text-left', 'label-xsmall');
                            tooltipHeader.appendChild(document.createTextNode(tooltip.title[0]));
                            tooltipEl.appendChild(tooltipHeader);
                            const tooltipBody = document.createElement('div');
                            tooltipBody.classList.add('flex', 'flex-col', 'gap-2', 'px-3', 'py-2', 'min-w-[12.5rem]');
                            tooltip.dataPoints.forEach((body: any) => {
                                const row = document.createElement('div');
                                row.classList.add('flex', 'items-center', 'gap-2', 'w-full');
                                const point = document.createElement('div');
                                point.classList.add('w-2.5', 'h-2.5', 'rounded-full');
                                point.style.backgroundColor = body.dataset.borderColor;
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

                        const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

                        tooltipEl.style.opacity = 1;
                        tooltipEl.style.font = tooltip.options.bodyFont.string;
                        tooltipEl.style.padding = '0px';

                        const chartWidth = chart.width;
                        const tooltipWidth = tooltipEl.offsetWidth;
                        const chartHeight = chart.height;
                        const tooltipHeight = tooltipEl.offsetHeight;

                        let tooltipX = positionX + avgX + 20;
                        let tooltipY = positionY + avgY - tooltipHeight / 2;

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
                        color: darkMode ? surface800Color : surface200Color
                    },
                    ticks: {
                        color: darkMode ? surface500Color : surface400Color,
                        autoSkip: false,
                        maxRotation: 0,
                        source: 'auto'
                    },
                    border: {
                        display: false,
                        dash: [4, 4]
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
