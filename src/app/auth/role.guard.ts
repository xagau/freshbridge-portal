import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    canActivate(): boolean {
        const currentUser = this.authService.currentUserValue;

        if (currentUser && currentUser.role === 'admin') {
            return true;
        }

        this.router.navigate(['/']);
        return false;
    }
}
