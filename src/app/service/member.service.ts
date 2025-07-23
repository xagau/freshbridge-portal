import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member } from '@/types/member';

@Injectable({
    providedIn: 'root'
})
export class MemberService {
    constructor(private http: HttpClient) {}

    getMembers() {
        return this.http
            .get<any>('/data/members.json')
            .toPromise()
            .then((res) => res.data as Member[])
            .then((data) => data);
    }
}
