import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '@/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: '[app-menu]',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule, ProgressSpinnerModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of filteredModel; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul>
    <p-progressSpinner *ngIf="isLoading" styleClass="w-full h-full" [style]="{ 'min-height': '200px' }" mode="indeterminate" />
    `
})
export class AppMenu implements OnInit, OnDestroy {
    model: any[];
    filteredModel: any[] = [];
    private destroy$ = new Subject<void>();
    
    isLoading = true;
    isUser = false;

    constructor(
        private authService: AuthService,
        private cdr: ChangeDetectorRef
    ) {
        this.model = this.buildMenu();
    }


    isAuthenticated() {
        return this.authService.isAuthenticated;
    }

    ngOnInit() {
        // Initial check
        this.isUser = this.isAuthenticated();
        console.log("isUser", this.isUser);
        
        this.updateMenu(this.authService.getStoredUser()?.role);
        console.log("updateMenu", this.authService.getStoredUser()?.role);
        
        this.isLoading = false;

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
        this.cdr.markForCheck();
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
                        roles: ['MERCHANT', 'BUYER', 'COURIER', 'ADMIN']
                    },
                    {
                        label: 'FreshSelect',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/freshselect'],
                        roles: ['MERCHANT', 'BUYER', 'ADMIN', 'COURIER']
                    },
                    {
                        label: 'Orders & Fulfillment',
                        icon: 'pi pi-fw pi-file-check',
                        routerLink: ['/order-management'],
                        roles: ['MERCHANT', 'BUYER', 'COURIER']
                    },
                    {
                        label: 'Product Listings',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/product-management'],
                        roles: ['MERCHANT', 'BUYER']
                    },
                    {
                        label: 'Payments & Invoices',
                        icon: 'pi pi-fw pi-credit-card',
                        routerLink: ['pi/transfer-history'],
                        roles: ['MERCHANT', 'BUYER', 'ADMIN']
                    },
                    {
                        label: 'Schedule Order',
                        icon: 'pi pi-fw pi-credit-card',
                        routerLink: ['schedule-order'],
                        roles: ['BUYER']
                    }
                ]
            },
            { separator: true },
            {
                label: 'Insights & Growth',
                icon: 'pi pi-fw pi-compass',
                items: [
                    
                    {
                        label: 'Audit Logs',
                        icon: 'pi pi-fw pi-file',
                        routerLink: ['audit-logs'],
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
                        label: 'Merchants Management',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['merchants-management'],
                        roles: ['ADMIN']
                    },
                    {
                        label: 'Buyers Management',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['buyers-management'],
                        roles: ['ADMIN']
                    },
                    // {
                    //     label: 'User Directory',
                    //     icon: 'pi pi-fw pi-folder-open',
                    //     routerLink: ['accounts-management/list'],
                    //     roles: ['ADMIN']
                    // },
                    // {
                    //     label: 'Add New User',
                    //     icon: 'pi pi-fw pi-plus',
                    //     routerLink: ['/accounts-management/create'],
                    //     roles: ['ADMIN']
                    // }
                ]
            }
        ];
    }

    private filterMenuByRole(menu: any[], role: string | undefined): any[] {
        console.log("menu", menu);
        console.log("role", role);
        
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
