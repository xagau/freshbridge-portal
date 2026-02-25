import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { LayoutService } from '@/layout/service/layout.service';
import { trackByFn } from '@/lib/utils';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ChartModule } from 'primeng/chart';
import { OrdersService } from '@/service/orders.service';
import { addDays, addWeeks, addMonths, isAfter, format } from 'date-fns';
import { AuthService } from '@/auth/auth.service';
import { DashboardDataService } from '@/service/dashboard-data.service';

@Component({
    selector: 'buyer-revenue-widget',
    standalone: true,
    imports: [CommonModule, ChartModule, TagModule, DividerModule, ButtonModule],
    template: `<div class="flex items-center justify-between">
            <span class="label-medium text-surface-950 dark:text-surface-0">{{ currentUser.role === 'MERCHANT' ? 'Monthly GMV' : 'Monthly Purchases' }}</span>
            <!-- <button pButton severity="secondary" outlined class="!text-surface-950 dark:!text-surface-0 !px-2 !py-1.5 !rounded-lg !label-xsmall"><span pButtonLabel>See All</span><i class="pi pi-chevron-right !text-xs"></i></button> -->
        </div>
        <div class="flex items-center gap-3.5 mt-4">
            <span class="title-h6">{{ totalAmount | currency }}</span>
            <!-- <p-tag severity="success" value="+12%" /> -->
        </div>
        @if (gmvTrendData()) {
            <p-chart type="line" [data]="gmvTrendData()" [options]="sparklineOptions"></p-chart>
        }

        <div class="mt-6 flex flex-col">
        <!-- Show only limited items initially -->
        @for (item of displayedRevenueData; track trackByFn(); let idx = $index ) {
            @if (item.amount > 0) {
                <div class="flex items-center gap-3.5">
                    <span class="flex-1 body-small text-left text-surface-950 dark:text-surface-0">
                        {{ item.date | date:'MMM d, yyyy' }}
                    </span>
                    <span class="label-small text-surface-950 dark:text-surface-0">
                        {{ item.amount | currency }}
                    </span>
                </div>
                <p-divider *ngIf="displayedRevenueData.length - 1 > idx" class="my-3" />
            }
        }
        
        <!-- Show "See More" button if there are more items to show -->
        @if (projectedRevenueData.length > initialDisplayCount) {
            <div class="flex justify-center duration-300">
                <p-button 
                class="mt-3 text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                (click)="toggleShowAll()"
            >
                {{ showAll ? 'See Less' : 'See More' }}
                </p-button>
            </div>
        }
        </div>`,
    host: {
        class: 'card !mb-0 flex-1 min-w-80 !p-6 border border-surface rounded-2xl'
    },
    styles: `
        :host ::ng-deep {
            .p-tag {
                padding: 0.25rem 0.5rem;

                .p-tag-label {
                    line-height: 1.5;
                    font-weight: 600;
                    font-size: 0.875rem !important;
                }
            }
        }
    `
})
export class BuyerRevenueWidget implements OnInit {
    protected readonly trackByFn = trackByFn;

    layoutService = inject(LayoutService);
    authService = inject(AuthService);
    dashboardDataService = inject(DashboardDataService);

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());

    gmvTrendData = signal<any>(undefined);
    projectedRevenueData: any[] = [];
    totalAmount: number = 0;

    initialDisplayCount = 5;

    // Flag to track if all items should be shown
    showAll = false;

    // Computed property for displayed data
    get displayedRevenueData() {
        return this.showAll
            ? this.projectedRevenueData
            : this.projectedRevenueData.slice(0, this.initialDisplayCount);
    }

    // Toggle between showing all and limited items
    toggleShowAll() {
        this.showAll = !this.showAll;
    }

    constructor(private orderService: OrdersService) { }

    ngOnInit(): void {
        this.setupUserInfo();
        this.loadOrders();
    }

    sparklineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: { display: false },
        legend: { display: false },
        elements: { line: { tension: 0 } }
    };

    currentUser: any = {
        userId: 0,
        role: ''
    }

    private setupUserInfo(): void {
        this.authService.currentUser$.subscribe(user => {
            if (user) {
                this.currentUser.userId = user?.id;
                this.currentUser.role = user?.role;
            }
        });
    }

    loadOrders(): void {
        // Use the shared dashboard data service instead of making a separate API call
        this.dashboardDataService.orders$.subscribe(orders => {
            if (orders && orders.length > 0) {
                const today = new Date();
                const revenueMap = new Map<string, number>();

                // Process all orders to calculate projected revenue
                orders.forEach(order => {

                    if (order.frequency === 'ONCE') {
                        // For one-time orders, use expected delivery date
                        if (order.expectedDeliveryDate) {
                            const deliveryDate = new Date(order.expectedDeliveryDate);
                            if (isAfter(deliveryDate, today)) {
                                this.addToRevenueMap(revenueMap, deliveryDate, order.totalAmount);
                            }
                        }
                    } else if (order.frequency === 'WEEKLY' && order.startDate && order.repeatOnDays) {
                        // For weekly orders, calculate all future delivery dates based on repeat days
                        const startDate = new Date(order.startDate);
                        const daysOfWeek = order.repeatOnDays.split(',');
                        const endDate = order.endDate ? new Date(order.endDate) : addMonths(today, 3); // Default to 3 months ahead if no end date

                        daysOfWeek.forEach((day: string) => {
                            let currentDate = this.getNextWeekday(startDate, day.trim());
                            while (isAfter(endDate, currentDate)) {
                                if (isAfter(currentDate, today)) {
                                    this.addToRevenueMap(revenueMap, currentDate, order.totalAmount);
                                }
                                currentDate = addWeeks(currentDate, 1);
                            }
                        });
                    } else if (order.frequency === 'BIWEEKLY' && order.startDate) {
                        // For biweekly orders, calculate every 2 weeks from start date
                        const startDate = new Date(order.startDate);
                        const deliveryDay = new Date(order.endDate).getDay();
                        const endDate = order.endDate ? new Date(order.endDate) : addMonths(today, 6); // Default to 6 months ahead

                        let currentDate = new Date(startDate);

                        // Find the first occurrence of the delivery day after start date
                        while (currentDate.getDay() !== deliveryDay) {
                            currentDate = addDays(currentDate, 1);
                        }

                        while (currentDate <= endDate) {
                            this.addToRevenueMap(revenueMap, currentDate, order.totalAmount);
                            // Move forward 2 weeks
                            currentDate = addDays(currentDate, 14);
                        }
                    } else if (order.frequency === 'MONTHLY' && order.startDate) {
                        // For monthly orders, calculate same day each month
                        const startDate = new Date(order.startDate);
                        const endDate = order.endDate ? new Date(order.endDate) : addMonths(today, 6);

                        let currentDate = new Date(startDate);
                        while (isAfter(endDate, currentDate)) {
                            if (isAfter(currentDate, today)) {
                                this.addToRevenueMap(revenueMap, currentDate, order.totalAmount);
                            }
                            currentDate = addMonths(currentDate, 1);
                        }
                    }
                });

                // Convert map to array and sort by date, but add 0 amount for dates that are not in the map
                // all dates from today to 1 month  every day
                const allDates = [];
                let startDate = new Date(today);
                const endDate = addMonths(today, 1);
                while (isAfter(endDate, startDate)) {
                    allDates.push(startDate);
                    startDate = addDays(startDate, 1);
                }

                allDates.forEach(date => {
                    if (!revenueMap.has(date.toISOString())) {
                        revenueMap.set(date.toISOString(), 0);
                    }
                });
                this.projectedRevenueData = Array.from(revenueMap.entries())
                    .map(([date, amount]) => ({
                        date: new Date(date),
                        amount
                    }))
                    .sort((a, b) => a.date.getTime() - b.date.getTime());
                // Calculate total projected revenue
                this.totalAmount = this.projectedRevenueData.reduce((sum, day) => sum + day.amount, 0);

                // Prepare chart data
                const labels = this.projectedRevenueData.map(day =>
                    format(day.date, 'MMM d')
                );
                const data = this.projectedRevenueData.map(day => day.amount);

                const newGmvTrendData = {
                    labels: labels,
                    datasets: [{
                        label: this.currentUser.role === 'BUYER' ? 'Revenue' : 'Sales',
                        data: data,
                        borderColor: '#42A5F5',
                        fill: false
                    }]
                };

                this.gmvTrendData.set(newGmvTrendData);
            }
        });
    }

    private addToRevenueMap(map: Map<string, number>, date: Date, amount: number): void {
        const dateKey = date.toISOString().split('T')[0];
        if (map.has(dateKey)) {
            map.set(dateKey, map.get(dateKey)! + amount);
        } else {
            map.set(dateKey, amount);
        }
    }

    private getNextWeekday(startDate: Date, weekday: string): Date {
        const weekdays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        const targetDay = weekdays.indexOf(weekday);
        const startDay = startDate.getDay();

        let daysToAdd = targetDay - startDay;
        if (daysToAdd < 0) daysToAdd += 7;

        return addDays(startDate, daysToAdd);
    }
}
