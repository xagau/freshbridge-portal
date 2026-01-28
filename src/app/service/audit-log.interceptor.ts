import { HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { AuthService } from '@/auth/auth.service';
import { AuditLogService } from '@/service/audit-log.service';
import { AuditLogCreateRequest, AuditLogStatus } from '@/model/audit-log.model';
import { environment } from '../../environments/environment';

const AUDIT_SKIP_HEADER = 'X-Skip-Audit';
const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export const auditLogInterceptor: HttpInterceptorFn = (req, next) => {
    const auditLogService = inject(AuditLogService);
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!shouldAudit(req)) {
        return next(req);
    }

    return next(req).pipe(
        tap((event) => {
            if (event instanceof HttpResponse) {
                const { status, details } = resolveStatus(req, event);
                logEvent(auditLogService, authService, router, req, status, undefined, details);
            }
        }),
        catchError((error) => {
            logEvent(auditLogService, authService, router, req, 'FAILED', error);
            return throwError(() => error);
        })
    );
};

function shouldAudit(req: HttpRequest<unknown>): boolean {
    if (req.headers.has(AUDIT_SKIP_HEADER)) {
        return false;
    }

    if (!WRITE_METHODS.has(req.method)) {
        return false;
    }

    if (!req.url.startsWith(environment.apiUrl)) {
        return false;
    }

    return !req.url.includes('/events');
}

function logEvent(
    auditLogService: AuditLogService,
    authService: AuthService,
    router: Router,
    req: HttpRequest<unknown>,
    status: AuditLogStatus,
    error?: any,
    overrideDetails?: string
) {
    const user = authService.getStoredUser();
    const resource = getApiResource(req.url);
    const { action, entityType, entityId } = getActionDescriptor(req.method, resource, status);
    const details = overrideDetails ?? buildDetails(status, error);

    const event: AuditLogCreateRequest = {
        timestamp: new Date().toISOString(),
        actorId: user?.id,
        actorName: user ? user.name || user.email : undefined,
        actorRole: user?.role,
        ipAddress: undefined,
        action,
        status,
        entityType,
        entityId,
        route: router.url,
        details,
        metadata: sanitizePayload(req.body)
    };

    auditLogService.logEvent(event).subscribe({
        error: () => {
            // Swallow audit logging failures to avoid breaking user actions.
        }
    });
}

function resolveStatus(req: HttpRequest<unknown>, response: HttpResponse<unknown>): {
    status: AuditLogStatus;
    details?: string;
} {
    const resource = getApiResource(req.url).toLowerCase();
    if (resource.startsWith('auth/login')) {
        const body: any = response.body;
        if (body?.error) {
            return { status: 'FAILED', details: body.error };
        }
    }

    return { status: 'SUCCESS' };
}

function getApiResource(url: string): string {
    const base = environment.apiUrl;
    const trimmed = url.startsWith(base) ? url.slice(base.length) : url;
    return trimmed.split('?')[0] || trimmed;
}

function getActionDescriptor(method: string, resource: string, status: AuditLogStatus): {
    action: string;
    entityType?: string;
    entityId?: string;
} {
    const normalized = resource.toLowerCase();

    if (normalized.startsWith('auth/login')) {
        return {
            action: status === 'SUCCESS' ? 'Password Accepted' : 'Password Failed',
            entityType: 'Auth'
        };
    }

    if (normalized.startsWith('auth/forgot-password')) {
        return {
            action: 'Forgot Password',
            entityType: 'Auth'
        };
    }

    if (normalized.startsWith('auth/reset-password')) {
        return {
            action: 'Password Changed',
            entityType: 'Auth'
        };
    }

    if (normalized.startsWith('auth/register/complete')) {
        return {
            action: 'Registration Completed',
            entityType: 'User'
        };
    }

    if (normalized.startsWith('auth/register')) {
        return {
            action: 'Register',
            entityType: 'User'
        };
    }

    if (normalized.startsWith('orders')) {
        const action = method === 'POST' ? 'Add Order'
            : method === 'DELETE' ? 'Delete Order'
                : 'Update Order';
        return { action, entityType: 'Order', entityId: getEntityId(resource) };
    }

    if (normalized.startsWith('buyers')) {
        const action = method === 'POST' ? 'Add Buyer'
            : method === 'DELETE' ? 'Delete Buyer'
                : 'Update Buyer';
        return { action, entityType: 'Buyer', entityId: getEntityId(resource) };
    }

    if (normalized.startsWith('merchants')) {
        const action = method === 'POST' ? 'Add Merchant'
            : method === 'DELETE' ? 'Delete Merchant'
                : 'Update Merchant';
        return { action, entityType: 'Merchant', entityId: getEntityId(resource) };
    }

    if (normalized.startsWith('products') || normalized.startsWith('merchant-products')) {
        const action = method === 'POST' ? 'Add Product'
            : method === 'DELETE' ? 'Delete Product'
                : 'Update Product';
        return { action, entityType: 'Product', entityId: getEntityId(resource) };
    }

    return {
        action: `${method} ${resource || 'request'}`,
        entityType: getEntityType(resource),
        entityId: getEntityId(resource)
    };
}

function getEntityType(resource: string): string | undefined {
    const segment = resource.split('/')[0];
    if (!segment) return undefined;
    return segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function getEntityId(resource: string): string | undefined {
    const parts = resource.split('/');
    const id = parts.length > 1 ? parts[1] : undefined;
    return id && !Number.isNaN(Number(id)) ? id : undefined;
}

function buildDetails(status: AuditLogStatus, error?: any): string | undefined {
    if (status === 'SUCCESS') {
        return undefined;
    }

    if (error?.error?.message) {
        return error.error.message;
    }

    return error?.message || 'Request failed';
}

function sanitizePayload(payload: unknown): Record<string, unknown> | undefined {
    if (!payload || typeof payload !== 'object') return undefined;
    if (payload instanceof FormData) return undefined;

    let clone: Record<string, unknown>;
    try {
        clone = JSON.parse(JSON.stringify(payload)) as Record<string, unknown>;
    } catch {
        return undefined;
    }
    const sensitiveKeys = ['password', 'newPassword', 'confirmPassword', 'resetCode', 'code', 'token'];

    for (const key of Object.keys(clone)) {
        if (sensitiveKeys.includes(key)) {
            clone[key] = '[REDACTED]';
        }
    }

    return clone;
}
