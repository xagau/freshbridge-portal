import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { AuditLogService } from '@/service/audit-log.service';
import { AuditLogEvent } from '@/model/audit-log.model';

@Component({
    selector: 'app-audit-logs',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ToolbarModule,
        ButtonModule,
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        TagModule,
        ToastModule,
        ProgressSpinnerModule
    ],
    templateUrl: './audit-logs.component.html',
    providers: [MessageService]
})
export class AuditLogsComponent implements OnInit {
    events = signal<AuditLogEvent[]>([]);
    loading = signal<boolean>(true);
    filterFields = ['action', 'actorName', 'actorRole', 'entityType', 'entityId', 'route', 'ipAddress', 'city', 'country', 'status'];

    constructor(
        private auditLogService: AuditLogService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.loadEvents();
    }

    loadEvents() {
        this.loading.set(true);
        this.auditLogService.getEvents().subscribe({
            next: (data) => {
                const normalized = (data ?? []).map((event) => ({
                    ...event,
                    timestamp: event.timestamp || event.createdAt || new Date().toISOString()
                }));
                this.events.set(normalized);
                this.loading.set(false);
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err?.message || 'Failed to load audit logs',
                    life: 3000
                });
                this.loading.set(false);
            }
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        const value = (event.target as HTMLInputElement).value;
        table.filterGlobal(value, 'contains');
    }

    formatActor(event: AuditLogEvent): string {
        if (event.actorName) return event.actorName;
        if (event.actorId != null) return `User #${event.actorId}`;
        return 'System';
    }

    getStatusSeverity(status?: string) {
        return status === 'SUCCESS' ? 'success' : 'danger';
    }
}
