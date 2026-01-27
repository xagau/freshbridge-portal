import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuditLogCreateRequest, AuditLogEvent } from '@/model/audit-log.model';

@Injectable({ providedIn: 'root' })
export class AuditLogService {
    private readonly AUDIT_ENDPOINT = `${environment.apiUrl}events`;
    private readonly SKIP_HEADER = 'X-Skip-Audit';

    constructor(private http: HttpClient) { }

    getEvents(): Observable<AuditLogEvent[]> {
        const now = new Date();
        const mockEvents: AuditLogEvent[] = [
            {
                id: 1,
                timestamp: now.toISOString(),
                actorId: 1,
                actorName: 'Admin User',
                actorRole: 'ADMIN',
                ipAddress: '135.181.68.17',
                action: 'Password Accepted',
                status: 'SUCCESS',
                entityType: 'Auth',
                route: '/auth/login'
            },
            {
                id: 2,
                timestamp: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
                actorId: 2,
                actorName: 'Buyer User',
                actorRole: 'BUYER',
                ipAddress: '198.51.100.24',
                action: 'Add Order',
                status: 'SUCCESS',
                entityType: 'Order',
                entityId: '451',
                route: '/order-management'
            },
            {
                id: 3,
                timestamp: new Date(now.getTime() - 12 * 60 * 1000).toISOString(),
                actorId: 3,
                actorName: 'Merchant User',
                actorRole: 'MERCHANT',
                ipAddress: '192.0.2.45',
                action: 'Delete Product',
                status: 'FAILED',
                entityType: 'Product',
                entityId: '88',
                route: '/product-management',
                details: 'Permission denied'
            }
        ];

        return of(mockEvents).pipe(
            switchMap((events) => this.attachGeo(events))
        );
    }

    logEvent(event: AuditLogCreateRequest): Observable<unknown> {
        const headers = new HttpHeaders().set(this.SKIP_HEADER, 'true');
        return this.http.post(this.AUDIT_ENDPOINT, event, { headers });
    }

    private attachGeo(events: AuditLogEvent[]): Observable<AuditLogEvent[]> {
        const uniqueIps = Array.from(new Set(events.map((event) => event.ipAddress).filter(Boolean))) as string[];
        if (!uniqueIps.length) {
            return of(events);
        }

        const lookups = uniqueIps.map((ip) =>
            this.http.get<any>(`https://ipapi.co/${ip}/json/`).pipe(
                map((data) => ({
                    ip,
                    city: data?.city || undefined,
                    country: data?.country_name || undefined
                })),
                catchError(() => of({ ip, city: undefined, country: undefined }))
            )
        );

        return forkJoin(lookups).pipe(
            map((results) => {
                const lookupMap = new Map(results.map((result) => [result.ip, result]));
                return events.map((event) => {
                    if (!event.ipAddress) return event;
                    const match = lookupMap.get(event.ipAddress);
                    if (!match) return event;
                    return {
                        ...event,
                        city: match.city,
                        country: match.country
                    };
                });
            })
        );
    }
}
