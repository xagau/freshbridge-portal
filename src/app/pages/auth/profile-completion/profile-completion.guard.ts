import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class ProfileCompletionGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): boolean {
        const user = this.authService.currentUserValue;
        if (user && user.role === 'USER') {
            return true; // Allow access to profile completion
        }

        // Redirect to dashboard if profile is already complete
        this.router.navigate(['/dashboard']);
        return false;
    }
}