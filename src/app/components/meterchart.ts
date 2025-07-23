import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, HostBinding, inject, input, output, untracked, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '@/layout/service/layout.service';
import { sampleDataByFixedLength, trackByFn } from '@/lib/utils';

@Component({
    selector: 'meter-chart',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div *ngIf="meterOptions?.showY" class="flex flex-col justify-between" [ngClass]="meterOptions.showX ? (meterOptionsProps().xAxisPosition === 'top' ? 'pt-8' : 'pb-8') : 'p-0'">
            @for (val of meterOptions.yAxis; track trackByFn(); let idx = $index) {
                <div class="body-xsmall leading-none text-right">
                    {{ idx === meterOptions?.yAxis.length - 1 ? 0 : (val / 1000).toFixed(1) + 'K' }}
                </div>
            }
        </div>
        <div class="flex-1 flex flex-col">
            <div #container class="flex-1 relative flex justify-between w-full h-full">
                @for (data of meterOptions?.data; track trackByFn(); let idx = $index) {
                    <div class="h-full flex items-center gap-3.5 transition-all" [ngClass]="meterOptionsProps()?.xAxisPosition === 'top' ? 'flex-col-reverse' : 'flex-col'">
                        <div class="flex-1 h-full flex flex-col items-center gap-2 transition-all">
                            <div class="w-[1px] h-1.5 bg-surface-950 dark:bg-surface-0 rounded-full"></div>
                            <div class="relative w-3 flex-1 flex flex-col justify-end cursor-pointer">
                                <div class="bg-surface-200 dark:bg-surface-800 rounded-full w-[0.5px] h-full absolute top-0 left-1/2 -translate-x-1/2"></div>
                                <div
                                    *ngIf="isDataArray"
                                    class="flex flex-col-reverse relative z-10 w-full rounded-full transition-all duration-300 overflow-hidden"
                                    [style]="{ height: (parseFloat(meterOptions.totalsByYAxis[idx]) / meterOptions?.max) * 100 + '%' }"
                                >
                                    @for (val of data.y; track trackByFn(); let j = $index) {
                                        <div class="w-full min-h-4" [style]="{ background: meterOptions.bgColors[j] ?? meterOptions.bgColors[0], height: (parseFloat(val) / meterOptions.totalsByYAxis[idx]) * 100 + '%' }"></div>
                                    }
                                </div>
                                <div
                                    *ngIf="!isDataArray"
                                    class="relative z-10 w-full rounded-full cursor-pointer transition-all duration-300 min-h-4"
                                    [style]="{ background: meterOptions.bgColors[0], height: (parseFloat(data.y) / meterOptions?.max) * 100 + '%' }"
                                ></div>
                            </div>
                            <div class="w-[1px] h-1.5 bg-surface-950 dark:bg-surface-0 rounded-full"></div>
                        </div>
                        <span class="body-xsmall">
                            {{ meterOptions?.labels?.[idx] ?? '' }}
                        </span>
                    </div>
                }
            </div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'flex gap-5 flex-1'
    }
})
export class MeterChart {
    @HostBinding('class') get classList() {
        return this.class();
    }

    protected readonly parseFloat = parseFloat;

    protected readonly trackByFn = trackByFn;

    layoutService = inject(LayoutService);

    class = input<string>('');

    show = input<number>(6);

    meterOptionsProps = input<any>({
        max: null,
        bgColors: null,
        labels: null,
        showX: false,
        showY: false,
        yAxis: null,
        data: null,
        xAxisPosition: 'bottom',
        timeUnit: 'week'
    });

    currency = input<string>('$');

    computedData = output<any>();

    data: any;

    meterOptions: any;

    container = viewChild<ElementRef>('container');

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());

    get isDataArray() {
        return Array.isArray(this.data[0].y);
    }

    constructor() {
        effect(() => {
            untracked(() => this.show());
            this.isDarkTheme();
            const { data, timeUnit } = this.meterOptionsProps();
            if (data) {
                this.data = sampleDataByFixedLength(data, timeUnit, this.show());
                this.meterOptions = this.setMeterOptions(timeUnit, this.data);

                this.computedData.emit(this.data);
            }
        });
    }

    setMeterOptions(option: any, _data: any) {
        const darkMode = this.isDarkTheme() ?? false;
        const rootStyles = getComputedStyle(document.documentElement);
        const surface0Color = rootStyles.getPropertyValue('--p-surface-0');
        const surface950Color = rootStyles.getPropertyValue('--p-surface-950');

        const data = _data;
        let totalsByYAxis = null;
        const max = () => {
            let maxy;
            if (typeof data[0].y == 'number') {
                maxy = data.reduce((max: any, obj: any) => (obj.y > max ? obj.y : max), data[0].y);
            } else {
                let max = -Infinity;
                totalsByYAxis = [];
                for (let i = 0; i < data.length; i++) {
                    const sum = data[i].y.reduce((acc: any, val: any) => acc + parseFloat(val), 0);
                    totalsByYAxis.push(sum);
                    if (sum > max) {
                        max = sum;
                    }
                }
                maxy = max;
            }
            return maxy;
        };
        const createLabels = () => {
            const labels = data.map((element: any) => {
                let val;
                const date = new Date(element.x);
                const days = ['Mn', 'Tu', 'Wd', 'Th', 'Fr', 'St', 'Su'];
                val = days[date.getDay()];
                return val;
            });
            return labels;
        };

        const maxVal = max();

        const defaultBgColors = [darkMode ? surface0Color : surface950Color];

        return {
            max: this.meterOptionsProps().max ?? maxVal * 1.25,
            bgColors: this.meterOptionsProps().bgColors ?? defaultBgColors,
            labels: this.meterOptionsProps().showX && (this.meterOptionsProps().labels ?? createLabels()),
            showX: this.meterOptionsProps().showX,
            showY: this.meterOptionsProps().showY,
            yAxis:
                this.meterOptionsProps().showY &&
                (this.meterOptionsProps().yAxis ??
                    Array(4)
                        .fill(null)
                        .map((_, i) => Math.ceil(maxVal * (1 - i / 3)))),
            data: data,
            xAxisPosition: this.meterOptionsProps().xAxisPosition,
            totalsByYAxis: totalsByYAxis,
            timeUnit: option
        };
    }
}
