import { Component } from '@angular/core';
import { RestaurantRevenueWidget } from '@/pages/dashboards/components/restaurantrevenuewidget';
import { MiniStatCardWidget } from '@/pages/dashboards/components/ministatcardwidget';
// import { OrdersWidget } from '@/pages/dashboards/components/orderswidget';
import { OrderByRestaurantWidget } from '@/pages/dashboards/components/orderbyrestaurantwidget';
import { GoogleLikeCalendarComponent } from '@/pages/dashboards/components/calendar/calendarwidget';
@Component({
    selector: 'app-ecommerce-dashboard',
    standalone: true,
    imports: [RestaurantRevenueWidget, MiniStatCardWidget, OrderByRestaurantWidget, GoogleLikeCalendarComponent],
    template: `<section class="flex flex-col gap-7">
        <div class="flex flex-wrap gap-7">
            <mini-stat-card-widget />
        </div>
        <app-google-like-calendar></app-google-like-calendar>
        <div class="flex flex-wrap gap-7">
            <restaurant-revenue-widget />
            <!-- <orders-widget /> -->
            <order-by-restaurant-widget />
        </div>
    </section>`
})
export class EcommerceDashboard { }
