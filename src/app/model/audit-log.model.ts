export type AuditLogStatus = 'SUCCESS' | 'FAILED';

export interface AuditLogEvent {
    id?: number;
    timestamp: string;
    createdAt?: string;
    actorId?: number;
    actorName?: string;
    actorRole?: string;
    ipAddress?: string;
    city?: string;
    country?: string;
    action: string;
    status: AuditLogStatus;
    entityType?: string;
    entityId?: string | number;
    route?: string;
    details?: string;
    metadata?: Record<string, unknown>;
}

export type AuditLogCreateRequest = Omit<AuditLogEvent, 'id'>;
