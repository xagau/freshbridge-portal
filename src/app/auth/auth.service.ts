import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, switchMap, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User, UserRole, Account } from './interfaces/user.interface';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';



interface LoginResponse {
    token: string;
    authUser: {
        user: User;
        merchantId?: number;
        buyerId?: number;
    };
    error: string;
}



@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly AUTH_TOKEN_KEY = 'freshbridge_auth_token';
    private readonly USER_DATA_KEY = 'freshbridge_user_data';
    private readonly PROFILE_ID_KEY = 'freshbridge_profile_id';
    private readonly PROFILE_TYPE_KEY = 'freshbridge_profile_type';

    private readonly SSO_TOKEN_KEY = 'freshbridge_sso_token';

    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser$: Observable<User | null>;
    private jwtHelper = new JwtHelperService();

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
        this.currentUser$ = this.currentUserSubject.asObservable();

    }

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    public get authToken(): string | null {
        return localStorage.getItem(this.AUTH_TOKEN_KEY);
    }


    public get isAuthenticated(): boolean {
        const token = this.authToken;
        return !!token && !this.jwtHelper.isTokenExpired(token);
    }

    login(usernameOrEmail: string, password: string): Observable<User> {
        console.log(`AuthService: Logging in with usernameOrEmail: ${usernameOrEmail}`);

        return this.http.post<LoginResponse>(`${environment.apiUrl}auth/login`, {
            usernameOrEmail,
            password
        }).pipe(
            tap((response) => {
                console.log("response:", response);
                if (response.error) {
                    throw new Error(response.error); 
                    
                } 
                
                this.storeAuthData(
                    response.token,
                    response.authUser.user,
                    response.authUser.merchantId,
                    response.authUser.buyerId
                );

                this.currentUserSubject.next(response.authUser.user);

            }),
            map(response => response.authUser.user),
            
            catchError(error => {
                console.error('Login error:', error);
                let errorMessage = error.message;
                return throwError(() => new Error(errorMessage));
            })
        );
    }

    public storeAuthData(
        token: string,
        user: User,
        merchantId?: number,
        buyerId?: number
    ): void {
        localStorage.setItem(this.AUTH_TOKEN_KEY, token);
        localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));
        if (merchantId) {
            localStorage.setItem(this.PROFILE_ID_KEY, merchantId.toString());
            localStorage.setItem(this.PROFILE_TYPE_KEY, 'merchant');
        } else if (buyerId) {
            localStorage.setItem(this.PROFILE_ID_KEY, buyerId.toString());
            localStorage.setItem(this.PROFILE_TYPE_KEY, 'buyer');
        }
    }


    logout(): void {
        this.clearAuthData();
        this.currentUserSubject.next(null);
        this.router.navigate(['/']);
    }

    register(userData: any): Observable<any> {
        return this.http.post(`${environment.apiUrl}auth/register`, userData).pipe(
            catchError(error => {
                console.error('Registration error:', error);
                let errorMessage = 'Registration failed';

                if (error.error && error.error.message) {
                    errorMessage = error.error.message;
                } else if (error.status === 400) {
                    errorMessage = 'Validation error';
                } else if (error.status === 409) {
                    errorMessage = 'User already exists';
                } else if (error.status === 0) {
                    errorMessage = 'Unable to connect to server';
                }

                return throwError(() => new Error(errorMessage));
            })
        );
    }

    completeRegistration(userId: number, userData: any): Observable<User> {
        return this.http.post<User>(`${environment.apiUrl}auth/register/complete/${userId}`, userData).pipe(
            tap((response) => {
                // store auth data
                localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(response));
                localStorage.setItem(this.PROFILE_ID_KEY, response.id.toString());
                localStorage.setItem(this.PROFILE_TYPE_KEY, response.role);

                this.currentUserSubject.next(response);
            }),
            catchError(error => {
                console.error('Complete registration error:', error);
                return throwError(() => new Error('Failed to complete registration'));
            })
        );
    }

    refreshToken(): Observable<string> {
        // In a real app, this would call your refresh token endpoint
        return of(this.generateMockToken()).pipe(
            tap((token) => {
                localStorage.setItem(this.AUTH_TOKEN_KEY, token);
            })
        );
    }

    hasRole(requiredRole: UserRole): boolean {
        const user = this.currentUserValue;
        return user?.role === requiredRole;
    }

    public getStoredUser(): User | null {
        const userData = localStorage.getItem(this.USER_DATA_KEY);
        return userData ? JSON.parse(userData) : null;
    }

    public getProfileId(): number | null {
        const userData = localStorage.getItem(this.USER_DATA_KEY);
        return userData ? JSON.parse(userData).id : null;
    }

    public getProfileMerchantId(): number | null {
        return localStorage.getItem(this.PROFILE_ID_KEY) ? parseInt(localStorage.getItem(this.PROFILE_ID_KEY) || '0') : null;
    }
    public getProfileBuyerId(): number | null {
        return localStorage.getItem(this.PROFILE_ID_KEY) ? parseInt(localStorage.getItem(this.PROFILE_ID_KEY) || '0') : null;
    }
    public getProfileType(): 'merchant' | 'buyer' | null {
        return localStorage.getItem(this.PROFILE_TYPE_KEY) as any;
    }

    private clearAuthData(): void {
        localStorage.removeItem(this.AUTH_TOKEN_KEY);
        localStorage.removeItem(this.USER_DATA_KEY);
        localStorage.removeItem(this.PROFILE_ID_KEY);
        localStorage.removeItem(this.PROFILE_TYPE_KEY);
    }

    googleLogin(): Observable<string> {
        return this.http.get<any>(`${environment.apiUrl}auth/google-login`).pipe(
            tap((response) => {
                console.log("response:", response)
                return response.url
            }),
            map(response => response.url)
        );
    }

    googleCallback(code: string): Observable<User> {
        return this.http.get<any>(`${environment.apiUrl}auth/callback?code=${code}`).pipe(
            tap((response) => {
                this.storeAuthData(
                    response.token,
                    response.authUser.user,
                    response.authUser.merchantId,
                    response.authUser.buyerId
                );
                this.currentUserSubject.next(response.authUser.user);

                if (response.authUser.user.role === 'USER') {
                    this.router.navigate(['/profile-completion'], {
                        queryParams: {
                            userId: response.authUser.user.id,
                            type: response.authUser.user.role
                        }
                    });
                } else if (response.authUser.user.role === 'COURIER') {
                    this.router.navigate(['/order-management']);
                } else if (response.authUser.user.role === 'MERCHANT' || response.authUser.user.role === 'BUYER') {
                    this.router.navigate(['/dashboard']);
                } else {
                    this.router.navigate(['/dashboard']);
                }
            }),
            map(response => response.authUser.user)
        )
    }

    // Apple SSO
    appleLogin(): Observable<User> {
        return this.mockAppleSSO().pipe(
            switchMap((appleUser) => {
                return this.http.post<LoginResponse>(`${environment.apiUrl}auth/sso-login`, {
                    email: appleUser.email,
                    name: appleUser.name,
                    ssoProvider: 'APPLE',
                    ssoId: appleUser.id
                }).pipe(
                    tap((response) => {
                        this.storeAuthData(
                            response.token,
                            response.authUser.user,
                            response.authUser.merchantId,
                            response.authUser.buyerId
                        );
                        this.currentUserSubject.next(response.authUser.user);

                        if (response.authUser.user.role === 'USER') {
                            this.router.navigate(['/profile-completion'], {
                                queryParams: {
                                    userId: response.authUser.user.id,
                                    type: response.authUser.user.role
                                }
                            });
                        } else if (response.authUser.merchantId) {
                            this.router.navigate(['/merchant/dashboard']);
                        } else if (response.authUser.buyerId) {
                            this.router.navigate(['/buyer/dashboard']);
                        } else {
                            this.router.navigate(['/dashboard']);
                        }
                    }),
                    map(response => response.authUser.user)
                );
            }),
            catchError(error => {
                console.error('Apple login error:', error);
                return throwError(() => new Error('Apple login failed'));
            })
        );
    }

    // Mock Google SSO - Replace with actual implementation
    private mockGoogleSSO(): Observable<{ email: string, name: string, id: string }> {
        return of({
            email: 'user@gmail.com',
            name: 'Google User',
            id: 'google-123'
        }).pipe(delay(500));
    }

    // Mock Apple SSO - Replace with actual implementation
    private mockAppleSSO(): Observable<{ email: string, name: string, id: string }> {
        return of({
            email: 'user@icloud.com',
            name: 'Apple User',
            id: 'apple-123'
        }).pipe(delay(500));
    }
    private generateMockToken(userId: string = '1', role: UserRole = 'USER'): string {
        // Create a fake JWT with three parts: header.payload.signature
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({
            sub: userId,
            role: role,
            exp: Math.floor(Date.now() / 1000) + 3600 // Expires in 1 hour
        }));
        const signature = 'mock-signature';
        return `${header}.${payload}.${signature}`;
    }


    getAccountInfo(id: number) {
        return this.http.get<Account>(`${environment.apiUrl}auth/${id}/info`);
    }

    withdraw(accountId: number, amount: number) {
        return this.http.post(`${environment.apiUrl}auth/${accountId}/withdraw`, { amount });
    }

    deposit(accountId: number, amount: number) {
        return this.http.post(`${environment.apiUrl}auth/${accountId}/deposit`, { amount });
    }
    refund(accountId: number, amount: number) {
        return this.http.post(`${environment.apiUrl}auth/${accountId}/refund`, { amount });
    }


    // Verification Email

    sendVerificationCode(email_phone: string): Observable<any> {
        console.log(email_phone);

        return this.http.post(`${environment.apiUrl}auth/send-verification`, { contact: email_phone }).pipe(
            catchError(error => {
                console.error('Verification code error:', error.error);
                return throwError(() => new Error(error.error.error || 'Failed to send verification code'));
            })
        );
    }

    verifyCode(email_phone: string, code: string): Observable<boolean> {
        return this.http.post<{ valid: boolean }>(`${environment.apiUrl}auth/verify-code`, { contact: email_phone, code }).pipe(
            tap((response) => {
                console.log(response);
            }),
            map(response => response?.valid || false),
            catchError(error => {
                console.error('Verification code error:', error);
                return throwError(() => new Error('Failed to verify code'));
            })

        );
    }

    forgotPassword(email: string) {
        return this.http.post(`${environment.apiUrl}auth/forgot-password`, { email });
    }

    verifyResetCode(contact: string, code: string) {
        return this.http.post(`${environment.apiUrl}auth/verify-code`, { contact, code });
    }

    resetPassword(contact: string, resetCode: string, newPassword: string) {
        return this.http.post(`${environment.apiUrl}auth/reset-password`, {
            contact,
            resetCode,
            newPassword
        });
    }

}
