import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '@/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: '[app-menu]',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of filteredModel; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul>`
})
export class AppMenu implements OnInit, OnDestroy {
    model: any[];
    filteredModel: any[] = [];
    private destroy$ = new Subject<void>();

    constructor(private authService: AuthService) {
        this.model = this.buildMenu();
    }

    ngOnInit() {
        // Initial check
        this.updateMenu(this.authService.getStoredUser()?.role);

        console.log(this.authService.getStoredUser()?.role);

        // Subscribe to user changes
        this.authService.currentUser$
            .pipe(takeUntil(this.destroy$))
            .subscribe(user => {
                if (user)
                    this.updateMenu(user?.role);
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private updateMenu(role: string | undefined) {
        // Always filter the menu, even if role is undefined (which will show only role-less items)
        this.filteredModel = this.filterMenuByRole(this.model, role);
    }

    private buildMenu(): any[] {
        return [
            {
                label: 'Marketplace',
                icon: 'pi pi-home',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-warehouse',
                        routerLink: ['/dashboard'],
                        roles: ['FARMER', 'RESTAURANT']
                    },
                    {
                        label: 'FreshSelect',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/freshselect'],
                        roles: ['FARMER', 'RESTAURANT', 'ADMIN', 'COURIER']
                    },
                    {
                        label: 'Orders & Fulfillment',
                        icon: 'pi pi-fw pi-file-check',
                        routerLink: ['/order-management'],
                        roles: ['FARMER', 'RESTAURANT', 'COURIER']
                    },
                    {
                        label: 'Product Listings',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/product-management'],
                        roles: ['FARMER', 'RESTAURANT']
                    },
                    {
                        label: 'Payments & Invoices',
                        icon: 'pi pi-fw pi-credit-card',
                        routerLink: ['pi/transfer-history'],
                        roles: ['FARMER', 'RESTAURANT']
                    },
                    {
                        label: 'Schedule Order',
                        icon: 'pi pi-fw pi-credit-card',
                        routerLink: ['schedule-order'],
                        roles: ['ADMIN', 'RESTAURANT']
                    }
                ]
            },
            { separator: true },
            {
                label: 'Insights & Growth',
                icon: 'pi pi-fw pi-compass',
                items: [
                    {
                        label: 'Analytics',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['analytics'],
                        roles: ['ADMIN']
                    }
                ]
            },
            { separator: true },
            {
                label: 'Accounts & Access',
                icon: 'pi pi-fw pi-wallet',
                items: [
                    {
                        label: 'Farmers Management',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['farmers-management'],
                        roles: ['ADMIN']
                    },
                    {
                        label: 'Restaurant Management',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['restaurant-management'],
                        roles: ['ADMIN']
                    },
                    {
                        label: 'User Directory',
                        icon: 'pi pi-fw pi-folder-open',
                        routerLink: ['accounts-management/list'],
                        roles: ['ADMIN']
                    },
                    {
                        label: 'Add New User',
                        icon: 'pi pi-fw pi-plus',
                        routerLink: ['/accounts-management/create'],
                        roles: ['ADMIN']
                    }
                ]
            }
        ];
    }

    private filterMenuByRole(menu: any[], role: string | undefined): any[] {
        return menu
            .map(group => {
                if (group.separator) return group;
                const items = group.items.filter(
                    (item: any) => !item.roles || (role && item.roles.includes(role))
                );
                return { ...group, items };
            })
            .filter(group => group.separator || group.items.length > 0);
    }
}
