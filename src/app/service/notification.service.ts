import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
// import SockJS from 'sockjs-client';
// import * as Stomp from 'stompjs';

export interface Notification {
    id: number;
    userId: number;
    type: string;
    title: string;
    body: string;
    createdAt: string;
    readAt: string | null;
    metadata: string | null;
    read: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private readonly API = environment.apiUrl + 'notifications';
    private stompClient: any;
    private notificationSubject = new Subject<Notification>();

    constructor(private http: HttpClient) {
        // this.initializeWebSocketConnection();
    }

    // private initializeWebSocketConnection() {
    //     const socket = new SockJS(environment.apiUrl + 'ws');
    //     this.stompClient = Stomp.over(socket);

    //     this.stompClient.connect({}, () => {
    //         // Connection established
    //     });
    // }

    // subscribeToNotifications(userId: number): Observable<Notification> {
    //     this.stompClient.subscribe(`/topic/notifications/${userId}`, (message: any) => {
    //         this.notificationSubject.next(JSON.parse(message.body));
    //     });
    //     return this.notificationSubject.asObservable();
    // }

    getRecentNotification(userId: number): Observable<Notification[]> {
        return this.http.get<Notification[]>(`${this.API}/recent/${userId}`);
    }

    markAsRead(userId: number, notificationIds: number[]): Observable<any> {
        const params = {
            notificationIds: notificationIds.join(','),
            userId: userId.toString()
        };
        return this.http.post(`${this.API}/mark-as-read`, null, { params });
    }
}