import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { addDays, addMonths, format, getDaysInMonth, getMonth, getYear, isSameDay, isSameMonth, isToday, lastDayOfMonth, startOfMonth, subMonths } from 'date-fns';
import { OrdersService } from '@/service/orders.service';
import { AuthService } from '@/auth/auth.service';
import { OrderDetailsModalComponent } from '@/components/order-details-modal/order-details-modal.component';
import { Order } from '@/model/order.model';
import { DashboardDataService } from '@/service/dashboard-data.service';

@Component({
    selector: 'app-google-like-calendar',
    standalone: true,
    imports: [CommonModule, ButtonModule, OrderDetailsModalComponent],
    templateUrl: './calendarwindget.html',
    styleUrls: ['./calendar.component.scss']
})
export class GoogleLikeCalendarComponent implements OnInit {
    currentDate: Date = new Date();
    currentMonth: Date = new Date();
    daysInMonth: number = 0;
    weeks: Date[][] = [];
    events: any[] = [];
    selectedOrder: Order | null = null;

    weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    currentUser: any = { userId: 0, role: "" };
    private orderService = inject(OrdersService);
    private authService = inject(AuthService);
    private dashboardDataService = inject(DashboardDataService);

    ngOnInit(): void {
        this.generateCalendar();
        this.loadEventsForMonth();
    }

    loadEventsForMonth(): void {
        // Get user info for display purposes
        this.authService.currentUser$.subscribe(user => {
            if (user) {
                this.currentUser.userId = user?.id;
                this.currentUser.role = user?.role;
            }
        });

        // Use the shared dashboard data service instead of making a separate API call
        this.dashboardDataService.orders$.subscribe((orders: Order[]) => {
            if (!orders || orders.length === 0) {
                return;
            }

            this.events = [];

            orders.forEach(order => {
                if (order.frequency === 'ONCE') {
                    // For one-time orders, use expectedDeliveryDate if available, otherwise orderDate
                    const eventDate = order.expectedDeliveryDate ?
                        new Date(order.expectedDeliveryDate) :
                        new Date(order.startDate);
                    this.addEventIfInMonth(order, eventDate);
                }
                else if (order.frequency === 'WEEKLY') {
                    this.handleWeeklyOrder(order);
                }
                else if (order.frequency === 'BIWEEKLY') {
                    this.handleBiweeklyOrder(order);
                }
                else if (order.frequency === 'MONTHLY') {
                    this.handleMonthlyOrder(order);
                }
            });
        });
    }

    private addEventIfInMonth(order: Order, date: Date) {
        if (isSameMonth(date, this.currentMonth)) {
            this.events.push(this.createEventObject(order, date));
        }
    }

    private createEventObject(order: Order, date: Date): any {
        return {
            id: order.id,
            title: `Order #${order.id}`,
            date: date,
            color: this.getColorByStatus(order.status),
            type: order.status,
            orderId: order.id,
            description: order.status
        };
    }

    private handleWeeklyOrder(order: Order) {
        if (!order.startDate || !order.repeatOnDays) return;

        const startDate = new Date(order.startDate);
        const endDate = order.endDate ? new Date(order.endDate) : addMonths(this.currentMonth, 3);

        // Convert repeatOnDays to weekday indices (0-6)
        const daysToRepeat = order.repeatOnDays.split(',')
            .map(day => {
                // Get first 3 letters and capitalize to match our weekdays array
                const shortDay = day.substring(0, 3).toUpperCase();
                // Find index in weekdays array (convert our weekday to uppercase for comparison)
                return this.weekdays.findIndex(w => w.toUpperCase() === shortDay);
            })
            .filter(index => index !== -1); // Filter out any invalid days

        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            daysToRepeat.forEach(dayIndex => {
                const eventDate = this.getNextWeekday(currentDate, dayIndex);
                if (eventDate <= endDate) {
                    this.addEventIfInMonth(order, eventDate);
                }
            });

            currentDate = addDays(currentDate, 7);
        }
    }

    private handleBiweeklyOrder(order: Order) {
        if (!order.startDate || !order.expectedDeliveryDate) return;

        const startDate = new Date(order.startDate);
        const deliveryDay = new Date(order.expectedDeliveryDate).getDay();
        const endDate = order.endDate ? new Date(order.endDate) : addMonths(this.currentMonth, 6); // Default to 6 months ahead

        let currentDate = new Date(startDate);

        // Find the first occurrence of the delivery day after start date
        while (currentDate.getDay() !== deliveryDay) {
            currentDate = addDays(currentDate, 1);
        }

        while (currentDate <= endDate) {
            this.addEventIfInMonth(order, new Date(currentDate));
            // Move forward 2 weeks
            currentDate = addDays(currentDate, 14);
        }
    }

    private handleMonthlyOrder(order: Order) {
        if (!order.startDate || !order.expectedDeliveryDate) return;

        const startDate = new Date(order.startDate);
        const deliveryDay = new Date(order.expectedDeliveryDate).getDate();
        const endDate = order.endDate ? new Date(order.endDate) : addMonths(this.currentMonth, 12); // Default to 1 year ahead

        let currentDate = new Date(startDate);

        // Set to the delivery day of the month
        currentDate.setDate(deliveryDay);
        if (currentDate < startDate) {
            // If we went before the start date, move to next month
            currentDate = addMonths(currentDate, 1);
            currentDate.setDate(deliveryDay);
        }

        while (currentDate <= endDate) {
            this.addEventIfInMonth(order, new Date(currentDate));
            // Move to same day next month
            currentDate = addMonths(currentDate, 1);
            currentDate.setDate(deliveryDay);
        }
    }

    private getNextWeekday(fromDate: Date, dayIndex: number): Date {
        const date = new Date(fromDate);
        const diff = (dayIndex - date.getDay() + 7) % 7;
        return addDays(date, diff);
    }

    getColorByStatus(status: string): string {
        switch (status) {
            case 'PENDING':
                return '#6c757d';
            case 'ACCEPTED':
                return '#17a2b8';
            case 'PREPARING':
                return '#ffc107';
            case 'READY_FOR_PICKUP':
                return '#6610f2';
            case 'DELIVERED':
            case 'COMPLETED':
                return '#28a745';
            case 'REJECTED':
                return '#dc3545';
            case 'CANCELLED':
                return '#dc3545';
            default:
                return '#6c757d';
        }
    }

    onEventClick(event: any) {
        if (event.orderId) {
            this.orderService.getOrderById(event.orderId).subscribe(order => {
                this.selectedOrder = order;
            });
        }
    }

    closeOrderModal() {
        this.selectedOrder = null;
    }

    // Event types by role with color mapping

    generateCalendar(): void {
        this.daysInMonth = getDaysInMonth(this.currentMonth);
        const firstDayOfMonth = startOfMonth(this.currentMonth);
        const lastDayOfMonthDate = lastDayOfMonth(this.currentMonth);

        let day = new Date(firstDayOfMonth);
        const weeks: Date[][] = [];
        let week: Date[] = [];

        // Add days from previous month if needed
        const firstDayOfWeek = day.getDay();
        if (firstDayOfWeek > 0) {
            const prevMonthDays = firstDayOfWeek;
            const prevMonth = subMonths(this.currentMonth, 1);
            const daysInPrevMonth = getDaysInMonth(prevMonth);

            for (let i = prevMonthDays - 1; i >= 0; i--) {
                week.push(new Date(getYear(prevMonth), getMonth(prevMonth), daysInPrevMonth - i));
                if (week.length === 7) {
                    weeks.push(week);
                    week = [];
                }
            }
        }

        // Add current month days
        while (day <= lastDayOfMonthDate) {
            week.push(new Date(day));
            if (week.length === 7) {
                weeks.push(week);
                week = [];
            }
            day = addDays(day, 1);
        }

        // Add days from next month if needed
        if (week.length > 0) {
            const nextMonth = addMonths(this.currentMonth, 1);
            let nextMonthDay = 1;
            while (week.length < 7) {
                week.push(new Date(getYear(nextMonth), getMonth(nextMonth), nextMonthDay++));
            }
            weeks.push(week);
        }

        this.weeks = weeks;
    }

    prevMonth(): void {
        this.currentMonth = subMonths(this.currentMonth, 1);
        this.generateCalendar();
        this.loadEventsForMonth();
    }

    nextMonth(): void {
        this.currentMonth = addMonths(this.currentMonth, 1);
        this.generateCalendar();
        this.loadEventsForMonth();
    }

    today(): void {
        this.currentMonth = new Date();
        this.generateCalendar();
        this.loadEventsForMonth();
    }

    getMonthYearString(): string {
        return format(this.currentMonth, 'MMMM yyyy');
    }

    isToday(date: Date): boolean {
        return isToday(date);
    }

    isCurrentMonth(date: Date): boolean {
        return isSameMonth(date, this.currentMonth);
    }

    getEventsForDay(date: Date): any[] {
        return this.events.filter((event) => isSameDay(event.date, date));
    }
}
