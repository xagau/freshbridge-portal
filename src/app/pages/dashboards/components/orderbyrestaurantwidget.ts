import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { LayoutService } from '@/layout/service/layout.service';
import { trackByFn } from '@/lib/utils';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { MeterChart } from '@/components/charts/meterchart';
import { OrdersService } from '@/service/orders.service';
import { format, subDays, parseISO, startOfDay, addDays, eachDayOfInterval, isWithinInterval, isAfter } from 'date-fns';
import { AuthService } from '@/auth/auth.service';

interface DailyData {
    date: Date;
    revenue: number;
    spending: number;
}

interface RestaurantData {
    id: number;
    name: string;
    revenue: number;
    spending: number;
    percentage: number;
    color?: string;
}

interface ChartDataPoint {
    x: Date | string;
    y: number[];
}

@Component({
    selector: 'order-by-restaurant-widget',
    standalone: true,
    imports: [CommonModule, TagModule, DividerModule, ButtonModule, MeterChart],
    template: ` <div class="flex items-center justify-between">
            <span class="label-medium text-surface-950 dark:text-surface-0">{{ currentUser.role === 'FARMER' ? 'Daily Revenue from Sales' : currentUser.role === 'RESTAURANT' ? 'Daily Revenue and Expenses' : 'Daily Revenue and Sales' }}</span>
            <button pButton severity="secondary" outlined class="!text-surface-950 dark:!text-surface-0 !px-2 !py-1.5 !rounded-lg !label-xsmall"><span pButtonLabel>See All</span><i class="pi pi-chevron-right !text-xs"></i></button>
        </div>
        <div class="flex items-center gap-3.5 mt-4">
            <span class="title-h6">{{ totalRevenue | currency }}</span>
            <p-tag severity="success" value="{{ growthPercentage }}%" />
        </div>
        <meter-chart 
            currency="$" 
            class="h-48 mt-8" 
            [meterOptionsProps]="meterOptionsProps()" 
            (computedData)="handleComputedValue($event)" 
        />
        <div class="mt-6 flex flex-col">
            <div class="flex items-center gap-3.5 mb-2">
                <span class="flex-1 body-small text-left text-surface-950 dark:text-surface-0 font-semibold">Daily Summary</span>
                <span class="label-small text-surface-950 dark:text-surface-0 font-semibold">{{ currentUser.role === 'FARMER' ? 'Sales' : 'Revenue' }}</span>
                <span class="label-small text-surface-500 font-semibold">{{ currentUser.role === 'FARMER' ? 'Spending' : 'Expenses' }}</span>
            </div>
            @for (day of dailyData; track trackByFn(); let idx = $index) {
                <div *ngIf="day.revenue" class="flex items-center gap-3.5">
                    <span class="flex-1 body-small text-left text-surface-950 dark:text-surface-0">{{ day.date | date:'MMM d' }}</span>
                    <span class="label-small text-surface-950 dark:text-surface-0">{{ day.revenue | currency }}</span>
                    <span class="label-small text-surface-500">{{ day.spending | currency }}</span>
                </div>
                <p-divider *ngIf="dailyData.length - 1 > idx && day.revenue" class="my-3" />
            }
        </div>`,
    host: {
        class: 'card !mb-0 flex-1 min-w-80 !p-6 border border-surface rounded-2xl'
    }
})
export class OrderByRestaurantWidget implements OnInit {
    protected readonly trackByFn = trackByFn;
    currentUser: any = {
        userId: 0,
        role: "FARMER"
    };

    layoutService = inject(LayoutService);
    orderService = inject(OrdersService);
    authService = inject(AuthService);

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());
    _computedData = signal<number[]>([]);

    dailyData: DailyData[] = [];
    restaurantData: RestaurantData[] = [];
    totalRevenue: number = 0;
    totalSpending: number = 0;
    growthPercentage: number = 0;
    previousDayTotal: number = 0;

    bgColors = ['#10B981', '#EF4444']; // Green for revenue, Red for spending

    meterOptionsProps = signal({
        data: [] as ChartDataPoint[],
        timeUnit: 'day',
        showY: true,
        showX: true,
        bgColors: this.bgColors,
        labels: [] as string[],
        xAxisPosition: 'bottom',
        max: 0,
        yAxis: [] as number[]
    });

    ngOnInit(): void {
        this.loadOrders();
    }

    private generateYAxis(maxValue: number): number[] {
        // Create 4 y-axis values from 0 to maxValue
        return Array.from({ length: 4 }, (_, i) => Math.ceil(maxValue * (1 - i / 3)));
    }


    loadOrders(): void {
        // TODO: Replace with real user ID
        let params: any = {};
        this.authService.currentUser$.subscribe(user => {
            if (user) {
                this.currentUser.userId = user?.id;
                this.currentUser.role = user?.role;
            }
            if (user?.role === 'RESTAURANT') {
                params = { restaurantId: this.currentUser.userId };
            }
            else if (user?.role === 'FARMER') {
                params = { farmerId: this.currentUser.userId };
            }
        })

        this.orderService.listByRole(params).subscribe((orders: any[]) => {
            // Filter completed orders
            const completedOrders = orders.filter(order => order.status === 'DELIVERED');

            // Process daily data
            this.processDailyData(completedOrders);

            // Prepare chart data
            this.prepareChartData();
        });

    }

    private processDailyData(orders: any[]): void {
        // Get last 7 days
        const days = eachDayOfInterval({
            start: subDays(new Date(), 6),
            end: new Date()
        }).map(date => ({
            date: startOfDay(date),
            revenue: 0,
            spending: 0
        }));

        // Calculate yesterday's total for growth percentage
        const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
        let yesterdayTotal = 0;

        orders.forEach(order => {
            if (!order.startDate || !order.endDate) return;

            const start = parseISO(order.startDate);
            const end = parseISO(order.endDate);
            const repeatDays = order.repeatOnDays
                ? order.repeatOnDays.split(',').map((d: string) => d.trim().toUpperCase())
                : []; let current = start;

            while (!isAfter(current, end)) {
                const currentDayName = format(current, 'EEEE').toUpperCase();

                if (repeatDays.includes(currentDayName) || order.frequency === 'ONCE') {
                    const dateKey = format(current, 'yyyy-MM-dd');
                    const day = days.find(d => format(d.date, 'yyyy-MM-dd') === dateKey);

                    if (day) {
                        day.revenue += order.totalAmount || 0;
                        day.spending += (order.totalAmount || 0) * 0.3;
                    }

                    if (dateKey === yesterday) {
                        yesterdayTotal += order.totalAmount || 0;
                    }

                    if (order.frequency === 'ONCE') break;  // No need to loop for ONCE
                }

                current = addDays(current, 1);
            }
        });

        this.dailyData = days.map(day => ({
            date: day.date,
            revenue: day.revenue,
            spending: day.spending
        }));

        // Calculate totals and growth
        this.totalRevenue = this.dailyData.reduce((sum, day) => sum + day.revenue, 0);
        this.totalSpending = this.dailyData.reduce((sum, day) => sum + day.spending, 0);
        this.growthPercentage = yesterdayTotal > 0
            ? Math.round(((this.dailyData[this.dailyData.length - 1].revenue - yesterdayTotal) / yesterdayTotal * 100))
            : this.dailyData[this.dailyData.length - 1].revenue > 0 ? 100 : 0;
    }

    private prepareChartData(): void {
        // Prepare data for the meter chart
        const chartData: ChartDataPoint[] = this.dailyData.map(day => ({
            x: day.date,
            y: [day.revenue, day.spending].map(val => val || 0) // Ensure we always have numbers
        }));

        const maxValue = Math.max(
            ...this.dailyData.map(day => day.revenue + day.spending),
            1000
        );
        this.meterOptionsProps.set({
            data: chartData,
            timeUnit: 'day',
            showY: true,
            showX: true,
            bgColors: this.bgColors,
            labels: this.dailyData.map(day => format(day.date, 'MMM d')),
            xAxisPosition: 'bottom',
            max: maxValue, // Explicitly set max value
            yAxis: this.generateYAxis(maxValue) // Generate proper y-axis values
        });
    }



    handleComputedValue(value: any) {
        if (value && Array.isArray(value)) {
            const totals = value.map(item => item.y.reduce((sum: number, val: number) => sum + val, 0));
            this._computedData.set(totals);
        }
    }
}