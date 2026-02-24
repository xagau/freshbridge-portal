import { Component, OnInit, inject } from '@angular/core';
import { BuyerRevenueWidget } from '@/pages/dashboards/components/buyerrevenuewidget';
import { MiniStatCardWidget } from '@/pages/dashboards/components/ministatcardwidget';
// import { OrdersWidget } from '@/pages/dashboards/components/orderswidget';
import { OrderByBuyerWidget } from '@/pages/dashboards/components/orderbybuyerwidget';
import { GoogleLikeCalendarComponent } from '@/pages/dashboards/components/calendar/calendarwidget';
import { DashboardDataService } from '@/service/dashboard-data.service';
import { BannerWidget } from '@/pages/dashboards/components/bannerwidget';

@Component({
    selector: 'app-ecommerce-dashboard',
    standalone: true,
    imports: [BuyerRevenueWidget, MiniStatCardWidget, OrderByBuyerWidget, GoogleLikeCalendarComponent, BannerWidget],
    template: `<section class="flex flex-col gap-7">
        <div class="page-header">
            <h1 class="page-title">Dashboard</h1>
        </div>
        
        <div class="flex flex-wrap gap-7">
            <banner-widget />
            <mini-stat-card-widget />
        </div>
        <app-google-like-calendar></app-google-like-calendar>
        <div class="flex flex-wrap gap-7">
            <buyer-revenue-widget />
            <!-- <orders-widget /> -->
            <order-by-buyer-widget />
        </div>
    </section>`
})
export class EcommerceDashboard implements OnInit {
    private dashboardDataService = inject(DashboardDataService);

    ngOnInit(): void {
        // Load orders data once for all dashboard components
        this.dashboardDataService.loadOrders();
    }
}
