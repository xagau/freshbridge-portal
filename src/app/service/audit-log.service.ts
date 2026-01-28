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
        return this.http.get<AuditLogEvent[]>(this.AUDIT_ENDPOINT).pipe(
            switchMap((events) => this.attachGeo(events)),
            catchError((error) => {
                console.error('Failed to fetch audit logs:', error);
                return of([]);
            })
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
