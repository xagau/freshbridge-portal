import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '@/service/notification.service';
import { AuthService } from '@/auth/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

type TabId = 'inbox' | 'unread' | 'read';

@Component({
    selector: 'app-notifications-page',
    standalone: true,
    imports: [
        CommonModule,
        ToastModule,
        ButtonModule,
        RippleModule,
        BadgeModule,
        AvatarModule,
        OverlayBadgeModule,
        TabsModule,
        CardModule,
        ProgressSpinnerModule,
    ],
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss'],
    providers: [MessageService],
})
export class NotificationsPageComponent implements OnInit {
    private notificationService = inject(NotificationService);
    private authService = inject(AuthService);
    private messageService = inject(MessageService);

    notificationsList = signal<Notification[]>([]);
    selectedTab = signal<TabId>('inbox');
    loading = signal(true);
    userId = 0;

    tabs = computed(() => {
        const all = this.notificationsList();
        const unreadCount = all.filter((n) => !n.read).length;
        return [
            { id: 'inbox' as TabId, label: 'Inbox', badge: all.length > 0 ? all.length.toString() : undefined },
            { id: 'unread' as TabId, label: 'Unread', badge: unreadCount > 0 ? unreadCount.toString() : undefined },
            { id: 'read' as TabId, label: 'Read' },
        ];
    });

    filteredNotifications = computed(() => {
        const selected = this.selectedTab();
        const all = this.notificationsList();
        if (selected === 'inbox') return all;
        if (selected === 'unread') return all.filter((n) => !n.read);
        if (selected === 'read') return all.filter((n) => n.read);
        return [];
    });

    hasUnread = computed(() => this.notificationsList().some((n) => !n.read));

    ngOnInit(): void {
        this.authService.currentUser$.subscribe((user) => {
            if (user?.id) {
                this.userId = user.id;
                this.loadNotifications();
            } else {
                this.loading.set(false);
            }
        });
    }

    loadNotifications(): void {
        this.loading.set(true);
        this.notificationService.getNotification(this.userId).subscribe({
            next: (list) => {
                this.notificationsList.set(list);
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load notifications',
                });
            },
        });
    }

    setTab(id: TabId): void {
        this.selectedTab.set(id);
    }

    markAllAsRead(): void {
        const unreadIds = this.notificationsList().filter((n) => !n.read).map((n) => n.id);
        if (unreadIds.length === 0) return;

        this.notificationService.markAsRead(this.userId, unreadIds).subscribe({
            next: () => {
                this.notificationsList.set(
                    this.notificationsList().map((n) =>
                        unreadIds.includes(n.id) ? { ...n, read: true, readAt: new Date().toISOString() } : n
                    )
                );
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'All notifications marked as read',
                    life: 3000,
                });
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to mark notifications as read',
                });
                console.error(err);
            },
        });
    }

    onNotificationClick(item: Notification): void {
        if (item.read) return;
        this.notificationService.markAsRead(this.userId, [item.id]).subscribe({
            next: () => {
                this.notificationsList.set(
                    this.notificationsList().map((n) =>
                        n.id === item.id ? { ...n, read: true, readAt: new Date().toISOString() } : n
                    )
                );
                this.messageService.add({
                    severity: 'success',
                    summary: 'Marked as read',
                    life: 2000,
                });
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to mark as read',
                });
                console.error(err);
            },
        });
    }
}
