import { Component, computed, ElementRef, inject, model, signal, ViewChild, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '@/layout/service/layout.service';
import { AppBreadcrumb } from './app.breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RippleModule } from 'primeng/ripple';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { AvatarModule } from 'primeng/avatar';
import { NotificationService, Notification } from '@/service/notification.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { AuthService } from '@/auth/auth.service';

interface NotificationsBars {
    id: string;
    label: string;
    badge?: string | any;
}

@Component({
    selector: '[app-topbar]',
    standalone: true,
    imports: [RouterModule, ToastModule, CommonModule, StyleClassModule, AppBreadcrumb, InputTextModule, ButtonModule, IconFieldModule, InputIconModule, RippleModule, BadgeModule, OverlayBadgeModule, AvatarModule],
    template: `<div class="layout-topbar">
        <div class="topbar-left">
            <div class="flex items-center gap-2">
                <a tabindex="0" #menubutton type="button" class="menu-button" (click)="onMenuButtonClick()">
                    <i class="pi pi-bars"></i>
                </a>
                <a tabindex="0" #backbutton type="button"  (click)="onBackPreviousPage()">
                    <i class="pi pi-chevron-left"></i>
                </a>
            </div>
            <img class="horizontal-logo" src="/images/logo-white.png" alt="fresh-bridge-layout" />
            <span class="topbar-separator"></span>
            <div app-breadcrumb></div>
            <img class="mobile-logo" src="/images/{{ isDarkTheme() ? 'logo-white.png' : 'logo.png' }}" alt="fresh-bridge-layout" />
        </div>

        <div class="topbar-right">
            <ul class="topbar-menu">
                <li class="email-display mr-4" *ngIf="userEmail()">
                    <span class="label-small text-surface-950 dark:text-surface-0 px-3 py-2 bg-surface-100 dark:bg-surface-800 rounded-lg">
                        {{ userEmail() }} <span *ngIf="userRole()" class="ml-2 font-semibold">({{ userRole() | titlecase }})</span>
                    </span>
                </li>
                <li class="right-sidebar-item">
                    <a class="right-sidebar-button" (click)="toggleSearchBar()" title="Fresh Select - AI Search">
                        <i class="pi pi-sparkles"></i>
                    </a>
                </li>
                <!-- <li class="right-sidebar-item">
                    <button class="app-config-button" (click)="onConfigButtonClick()"><i class="pi pi-cog"></i></button>
                </li> -->
                <li class="right-sidebar-item static sm:relative">
                    <a class="right-sidebar-button relative z-50" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveActiveClass="animate-fadeout" leaveToClass="hidden" [hideOnOutsideClick]="true">
                        <span class="w-2 h-2 rounded-full bg-red-500 absolute top-2 right-2.5"></span>
                        <i class="pi pi-bell"></i>
                    </a>
                    <div
                        class="list-none m-0 rounded-2xl border border-surface absolute bg-surface-0 dark:bg-surface-900 overflow-hidden hidden origin-top min-w-72 sm:w-[22rem] mt-2 z-50 top-auto shadow-[0px_56px_16px_0px_rgba(0,0,0,0.00),0px_36px_14px_0px_rgba(0,0,0,0.01),0px_20px_12px_0px_rgba(0,0,0,0.02),0px_9px_9px_0px_rgba(0,0,0,0.03),0px_2px_5px_0px_rgba(0,0,0,0.04)]"
                        style="right: -100px"
                    >
                        <div class="p-4 flex items-center justify-between border-b border-surface">
                            <span class="label-small text-surface-950 dark:text-surface-0">Notifications</span>
                            <button
                                pRipple
                                class="py-1 px-2 text-surface-950 dark:text-surface-0 label-x-small hover:bg-emphasis border border-surface rounded-lg shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)] transition-all"
                                (click)="markAllAsRead()"
                            >
                                Mark all as read
                            </button>
                        </div>
                        <div class="flex items-center border-b border-surface">
                            @for (item of notificationsBars(); track item.id; let i = $index) {
                                <button
                                    [ngClass]="{ 'border-surface-950 dark:border-surface-0': selectedNotificationBar() === item.id, 'border-transparent': selectedNotificationBar() !== item.id }"
                                    class="px-3.5 py-2 inline-flex items-center border-b gap-2"
                                    (click)="selectedNotificationBar.set(item.id)"
                                >
                                    <span [ngClass]="{ 'text-surface-950 dark:text-surface-0': selectedNotificationBar() === item.id }" class="label-small">{{ item.label }}</span>
                                    <p-badge *ngIf="item?.badge" [value]="item.badge" severity="success" size="small" class="!rounded-md" />
                                </button>
                            }
                        </div>
                        <ul class="flex flex-col divide-y divide-[var(--surface-border)] max-h-80 overflow-auto">
                            <ng-container *ngFor="let item of selectedNotificationsBarData(); let i = index">
                                <li>
                                    <div
                                        class="flex items-center gap-3 px-6 py-3.5 cursor-pointer hover:bg-emphasis transition-all"
                                        [ngClass]="item.read ? 'opacity-60' : 'bg-gray-100 font-semibold'"
                                        (click)="onNotificationClick(item)"
                                    >
                                        <p-overlay-badge value="" [severity]="item.read ? 'info': 'danger'" class="inline-flex">
                                            <p-avatar size="large">
                                                <img [src]="item.read ? '/images/icon/check.png' : '/images/icon/info.webp'" class="rounded-lg" />
                                            </p-avatar>
                                        </p-overlay-badge>
                                        <div class="flex flex-col">
                                            <span class="label-small text-left text-surface-950 dark:text-surface-0">{{ item.title }}</span>
                                            <span class="label-xsmall text-left line-clamp-1">{{ item.body }}</span>
                                            <span class="label-xsmall text-left">{{ item.createdAt | date:'short' }}</span>
                                        </div>
                                    </div>
                                </li>
                            </ng-container>
                        </ul>
                    </div>
                </li>
                <li class="profile-item static sm:relative">
                    <a class="right-sidebar-button relative z-50" pStyleClass="@next" enterFromClass="hidden"
                     enterActiveClass="animate-scalein" leaveActiveClass="animate-fadeout" leaveToClass="hidden" 
                     [hideOnOutsideClick]="true">
                        <p-avatar styleClass="!w-10 !h-10">
                            <div class="relative w-10 h-10 overflow-hidden bg-neutral-secondary-medium rounded-full">
                                <svg class="absolute w-12 h-12 text-body-subtle -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                            </div>
                        </p-avatar>
                    </a>
                    <div
                        #profileMenu
                        class="list-none p-2 m-0 rounded-2xl border border-surface overflow-hidden absolute bg-surface-0 dark:bg-surface-900 hidden origin-top w-52 mt-2 right-0 z-[999] top-auto shadow-[0px_56px_16px_0px_rgba(0,0,0,0.00),0px_36px_14px_0px_rgba(0,0,0,0.01),0px_20px_12px_0px_rgba(0,0,0,0.02),0px_9px_9px_0px_rgba(0,0,0,0.03),0px_2px_5px_0px_rgba(0,0,0,0.04)]"
                    >
                        <ul class="flex flex-col gap-1">
                            <li>
                                <a 
                                routerLink="/profile" 
                                (click)="hideProfileMenu()"
                                class="label-small dark:text-surface-400 flex gap-2 py-2 px-2.5 rounded-lg items-center hover:bg-emphasis transition-colors duration-150 cursor-pointer">
                                    <i class="pi pi-user"></i>
                                    <span>Profile</span>
                                </a>
                            </li>
                            <li>
                                <a routerLink="/settings-security" (click)="hideProfileMenu()" class="label-small dark:text-surface-400 flex gap-2 py-2 px-2.5 rounded-lg items-center hover:bg-emphasis transition-colors duration-150 cursor-pointer">
                                    <i class="pi pi-cog"></i>
                                    <span>Settings</span>
                                </a>
                            </li>
                            <li>
                                <a (click)="logout()" class="label-small dark:text-surface-400 flex gap-2 py-2 px-2.5 rounded-lg items-center hover:bg-emphasis transition-colors duration-150 cursor-pointer">
                                    <i class="pi pi-power-off"></i>
                                    <span>Log out</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    <p-toast></p-toast>`,
    providers: [MessageService, AuthService],
})
export class AppTopbar implements OnInit {
    layoutService = inject(LayoutService);
    notificationService = inject(NotificationService);
    messageService = inject(MessageService);
    authService = inject(AuthService);


    isDarkTheme = computed(() => this.layoutService.isDarkTheme());

    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('profileMenu') profileMenuRef!: ElementRef;

    notificationsBars = computed<NotificationsBars[]>(() => {
        const all = this.notificationsList();
        const unReadCount = all.filter(n => !n.read).length;
        return [
            {
                id: 'inbox',
                label: 'Inbox',
                badge: all.length > 0 ? all.length.toString() : undefined
            },
            {
                id: 'unread',
                label: 'Unread',
                badge: unReadCount > 0 ? unReadCount.toString() : undefined
            },
            {
                id: 'read',
                label: 'Read',
            }
        ];
    });

    notificationsList = signal<Notification[]>([]);

    userId: number = 0;
    userEmail = signal<string>('');
    userRole = signal<string>('');

    private notificationSubscription: Subscription | null = null;

    ngOnInit() {

        this.authService.currentUser$.subscribe(user => {
            if (user) {
                this.userId = user.id;
                this.userEmail.set(user?.email || '');
                this.userRole.set(user?.role || '');

                console.log("user:", user);
                this.loadNotifications(user.id || 0);
            }
        });
    }

    logout() {
        this.authService.logout();
    }

    /** Hide the profile/settings dropdown (same as leaveToClass="hidden") when navigating to Profile or Settings */
    hideProfileMenu() {
        this.profileMenuRef?.nativeElement?.classList.add('hidden');
    }
    // private setupWebSocket() {
    //     this.notificationService.subscribeToNotifications(this.userId).subscribe(notification => {
    //         // Add new notification to the top of the list
    //         this.notificationsList.update(list => [notification, ...list]);

    //         // Show toast for new notification
    //         this.messageService.add({
    //             severity: 'info',
    //             summary: notification.title,
    //             detail: notification.body,
    //             life: 5000
    //         });
    //     });
    // }

    onBackPreviousPage() {
        window.history.back();
    }

    ngOnDestroy() {
        if (this.notificationSubscription) {
            this.notificationSubscription.unsubscribe();
        }
    }

    loadNotifications(userId: number) {
        this.notificationService.getRecentNotification(userId).subscribe(list => {
            console.log("list:", list);
            this.notificationsList.set(list);
        });
    }

    selectedNotificationBar = model(this.notificationsBars()[0].id ?? 'inbox');

    // Filter notifications based on selected bar
    selectedNotificationsBarData = computed(() => {
        const selected = this.selectedNotificationBar();
        const all = this.notificationsList();
        if (selected === 'inbox') {
            return all;
        }
        if (selected === 'unread') {
            return all.filter(n => !n.read);
        }
        if (selected === 'read') {
            return all.filter(n => n.read);
        }
        return [];
    });

    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    showRightMenu() {
        this.layoutService.toggleRightMenu();
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }

    toggleSearchBar() {
        this.layoutService.layoutState.update((value) => ({ ...value, searchBarActive: !value.searchBarActive }));
    }


    markAllAsRead() {
        const unreadIds = this.notificationsList().filter(n => !n.read).map(n => n.id);
        if (unreadIds.length === 0) return;

        this.notificationService.markAsRead(this.userId, unreadIds).subscribe({
            next: () => {
                // Update local state
                this.notificationsList.set(
                    this.notificationsList().map(n =>
                        unreadIds.includes(n.id)
                            ? { ...n, read: true, readAt: new Date().toISOString() }
                            : n
                    )
                );
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'All notifications marked as read',
                    life: 3000
                });
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to mark notifications as read'
                });
                console.error('Error marking notifications as read', err);
            }
        });
    }

    onNotificationClick(item: Notification) {
        if (!item.read) {
            this.notificationService.markAsRead(this.userId, [item.id]).subscribe({
                next: () => {
                    // Update only this notification as read in local state
                    this.notificationsList.set(
                        this.notificationsList().map(n =>
                            n.id === item.id ? { ...n, read: true, readAt: new Date().toISOString() } : n
                        )
                    );
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Notification marked as read'
                    });
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to mark notification as read'
                    });
                    console.error('Error marking notification as read', err);
                }
            });
        }
    }
}
