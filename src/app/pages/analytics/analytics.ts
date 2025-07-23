// analytics.component.ts
import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, ChartModule, CardModule, TabViewModule],
  template: `
    <div class="grid">
      <div class="col-12">
        <p-tabView>
          <p-tabPanel header="Farmer Analytics">
            <div class="grid grid-cols-12 gap-4">
              <!-- Revenue Chart -->
              <div class="col-span-12 md:col-span-6">
                <p-card header="Total Revenue by Month">
                  <p-chart type="bar" [data]="revenueData" [options]="chartOptions"></p-chart>
                </p-card>
              </div>

              <!-- Units Sold -->
              <div class="col-span-12 md:col-span-6">
                <p-card header="Units Sold by Product">
                  <p-chart type="polarArea" [data]="unitsSoldData" [options]="chartOptions"></p-chart>
                </p-card>
              </div>

              <!-- Buyer Breakdown -->
              <div class="col-span-12 md:col-span-6">
                <p-card header="Buyer Type Breakdown">
                  <p-chart type="doughnut" [data]="buyerTypeData" [options]="pieOptions"></p-chart>
                </p-card>
              </div>

              <!-- Delivery Timeliness -->
              <div class="col-span-12 md:col-span-6">
                <p-card header="Delivery Timeliness">
                  <p-chart type="bar" [data]="deliveryData" [options]="stackedOptions"></p-chart>
                </p-card>
              </div>
            </div>
          </p-tabPanel>

          <p-tabPanel header="Buyer Analytics">
            <div class="grid grid-cols-12 gap-4">
              <!-- Spend by Vendor -->
              <div class="col-span-12 md:col-span-6">
                <p-card header="Spend by Vendor">
                  <p-chart type="pie" [data]="vendorSpendData" [options]="pieOptions"></p-chart>
                </p-card>
              </div>

              <!-- Fill Rate -->
              <div class="col-span-12 md:col-span-6">
                <p-card header="Fill Rate Over Time">
                  <p-chart type="line" [data]="fillRateData" [options]="chartOptions"></p-chart>
                </p-card>
              </div>
            </div>
          </p-tabPanel>

          <p-tabPanel header="Platform Analytics">
            <div class="grid grid-cols-12 gap-4">
              <!-- GMV KPI -->
              <div class="col-span-12 md:col-span-6">
                <p-card header="Gross Marketplace Volume">
                  <div class="text-4xl font-bold mb-2">$1.2M</div>
                  <p-chart type="line" [data]="gmvTrendData" [options]="sparklineOptions"></p-chart>
                </p-card>
              </div>

              <!-- User Growth -->
              <div class="col-span-12 md:col-span-6">
                <p-card header="User Growth">
                  <p-chart type="pie" [data]="userGrowthData" [options]="chartOptions"></p-chart>
                </p-card>
              </div>

              <!-- Revenue Breakdown -->
              <div class="col-span-12">
                <p-card header="Revenue by Type">
                  <p-chart type="bar" [data]="revenueTypeData" [options]="stackedOptions"></p-chart>
                </p-card>
              </div>
            </div>
          </p-tabPanel>
        </p-tabView>
      </div>
    </div>
  `,
  styles: [`
    .p-card {
      // height: 100%;
      display: flex;
      flex-direction: column;
    }
    .p-card-content {
      flex-grow: 1;
    }
  `]
})
export class AnalyticsComponent {
  // Chart Options
  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true }
    }
  };

  pieOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  stackedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: true },
      y: { stacked: true }
    }
  };

  sparklineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { display: false },
    legend: { display: false },
    elements: { line: { tension: 0.4 } }
  };

  // Farmer Analytics Data
  revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: '2023',
        backgroundColor: '#42A5F5',
        data: [65000, 59000, 80000, 81000, 56000, 75000]
      },
      {
        label: '2024',
        backgroundColor: '#FFA726',
        data: [72000, 68000, 85000, 90000, 62000, 82000]
      }
    ]
  };

  unitsSoldData = {
    labels: ['Tomatoes', 'Onions', 'Lettuce', 'Potatoes', 'Carrots'],
    datasets: [
      {
        label: 'Units Sold',
        backgroundColor: '#66BB6A',
        data: [1200, 900, 750, 600, 450]
      }
    ]
  };

  buyerTypeData = {
    labels: ['Restaurants', 'Grocers', 'Institutions', 'Direct Consumers'],
    datasets: [
      {
        data: [45, 30, 15, 10],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }
    ]
  };

  deliveryData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'On Time',
        backgroundColor: '#66BB6A',
        data: [85, 79, 92, 88, 91, 89]
      },
      {
        label: 'Late',
        backgroundColor: '#EF5350',
        data: [15, 21, 8, 12, 9, 11]
      }
    ]
  };

  // Buyer Analytics Data
  vendorSpendData = {
    labels: ['Green Valley', 'Sunny Acres', 'Organic Hills', 'Riverbend', 'Others'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
      }
    ]
  };

  fillRateData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Fill Rate %',
        borderColor: '#42A5F5',
        data: [92, 95, 97, 96, 98, 99],
        fill: false,
        tension: 0.4
      }
    ]
  };

  // Platform Analytics Data
  gmvTrendData = {
    labels: ['', '', '', '', '', ''],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 75],
        borderColor: '#42A5F5',
        fill: false
      }
    ]
  };

  userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Farmers',
        borderColor: '#FFA726',
        data: [120, 145, 165, 190, 210, 240],
        fill: false
      },
      {
        label: 'Buyers',
        borderColor: '#66BB6A',
        data: [85, 110, 135, 160, 185, 220],
        fill: false
      }
    ]
  };

  revenueTypeData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Transaction Fees',
        backgroundColor: '#42A5F5',
        data: [12000, 15000, 18000, 21000, 19000, 22000]
      },
      {
        label: 'Subscriptions',
        backgroundColor: '#66BB6A',
        data: [8000, 8500, 9000, 9500, 10000, 10500]
      },
      {
        label: 'Logistics',
        backgroundColor: '#FFA726',
        data: [5000, 5500, 6000, 6500, 7000, 7500]
      }
    ]
  };
}