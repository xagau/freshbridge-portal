import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!this.authService.isAuthenticated) {
            this.router.navigate(['/auth/login']);
            return false;
        }

        const user = this.authService.currentUserValue;
        if (user && user.role === 'USER') {
            this.router.navigate(['/profile-completion'], {
                queryParams: {
                    userId: user.id
                }
            });
        }
        const requiredRoles = route.data['roles'] as string[] | undefined;

        if (requiredRoles && !requiredRoles.includes(this.authService.currentUserValue?.role || '')) {
            this.router.navigate(['/notfound']);
            return false;
        }

        return true;
    }
}
