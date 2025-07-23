import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@/auth/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { environment } from '../../../../environments/environment';
import { User } from '@/types/user';

@Component({
    selector: 'app-google-callback',
    standalone: true,
    imports: [CommonModule, ToastModule, ProgressSpinnerModule],
    providers: [MessageService],
    template: `
        <div class="flex align-items-center justify-content-center min-h-screen">
            <div class="text-center">
                <p-progressSpinner 
                    [style]="{width: '50px', height: '50px'}" 
                    styleClass="custom-spinner" 
                    strokeWidth="8" 
                    fill="var(--surface-ground)" 
                    animationDuration=".5s">
                </p-progressSpinner>
                <h2 class="mt-3">Processing Google Sign-In...</h2>
                <p class="text-500">Please wait while we complete your authentication.</p>
            </div>
        </div>
        <p-toast></p-toast>
    `,
    styles: [`
        .custom-spinner .p-progress-spinner-circle {
            animation: custom-progress-spinner-dash 1.5s ease-in-out infinite, custom-progress-spinner-color 6s ease-in-out infinite;
        }
        
        @keyframes custom-progress-spinner-color {
            100%,
            0% {
                stroke: #166087;
            }
            40% {
                stroke: #166087;
            }
            66% {
                stroke: #166087;
            }
            80%,
            90% {
                stroke: #166087;
            }
        }
        
        @keyframes custom-progress-spinner-dash {
            0% {
                stroke-dasharray: 1, 200;
                stroke-dashoffset: 0;
            }
            50% {
                stroke-dasharray: 89, 200;
                stroke-dashoffset: -35px;
            }
            100% {
                stroke-dasharray: 89, 200;
                stroke-dashoffset: -124px;
            }
        }
    `]
})
export class GoogleCallback implements OnInit {
    loading = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.handleGoogleCallback();
    }

    private handleGoogleCallback(): void {
        this.route.queryParams.subscribe(params => {
            const code = params['code'];
            const error = params['error'];
            
            if (error) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Authentication Error',
                    detail: 'Google authentication failed. Please try again.'
                });
                setTimeout(() => {
                    this.router.navigate(['/auth/login']);
                }, 2000);
                return;
            }

            if (code) {
                // Make request to backend to exchange code for token
                this.authService.googleCallback(code)
                    .subscribe({
                        next: (result: any) => {
                            console.log("result:", result);
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Authentication Success',
                                detail: 'Google authentication completed successfully.'
                            });
                           
                        }
                    });
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Authentication Error',
                    detail: 'No authorization code received from Google.'
                });
                setTimeout(() => {
                    this.router.navigate(['/auth/login']);
                }, 2000);
            }
        });
    }
} 