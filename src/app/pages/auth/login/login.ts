import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
// import { AppleWidget } from '@/pages/auth/components/applewidget';
import { GoogleWidget } from '@/pages/auth/components/googlewidget';
import { LazyImageWidget } from '@/pages/components/landing/components/lazyimagewidget';
import { LogoWidget } from '@/pages/components/landing/components/logowidget';
import { AuthService } from '@/auth/auth.service';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { VerificationCodeModalComponent } from '@/components/verification-code-modal/verification-code-modal.component';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [LogoWidget, VerificationCodeModalComponent, CommonModule, ReactiveFormsModule, InputTextModule, LazyImageWidget, GoogleWidget, CheckboxModule, RouterLink, ToastModule],
    providers: [MessageService],
    templateUrl: './login.component.html'
})
export class Login {
    loginForm: FormGroup;
    currentYear: number = new Date().getFullYear();
    showPassword: boolean = false;
    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService,

    ) {
        this.loginForm = this.fb.group({
            email: [''],
            password: [''],
            remember: [false]
        });
    }
    loading = false;
    error = '';
    otpDialogVisible = false;
    otpCode = '';
    otpLoading = false;

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }
    onSubmit(): void {
        this.loading = true;

        if (this.loginForm.invalid) {
            this.loading = false;
            return;
        }

        this.error = '';

        const { email, password } = this.loginForm.value;

        // the mail should be trim
        const emailTrim = email!.trim();
        this.authService.login(emailTrim, password).subscribe({
            next: (success) => {
                if (success) {
                    // implement two factor authentication with verification modal
                    console.log("success:", success);
                    
                    if (success.twoFaEnabled) {
                        this.otpDialogVisible = true;
                        this.otpCode = '';
                        this.otpLoading = false;
                    } else {
                        const returnUrl = this.router.parseUrl(this.router.url).queryParams['returnUrl'] || '/dashboard';
                        
                        this.router.navigateByUrl(returnUrl);
                    }
                } else {
                    this.error = '';
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Invalid email or password'
                    });
                }
                this.loading = false;
            },
            error: (error) => {
                console.log("error:", error);
                this.error = '';
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error
                });
                this.loading = false;
            }
        });
    }


    confirmOtp() {
        const currentUser = this.authService.currentUserValue;
        if (!currentUser || !this.otpCode) {
            return;
        }
        if (!this.otpCode) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please enter a code.'
            });
            return;
        }
        this.otpLoading = true;
        this.authService.validateTwoFa(currentUser.id, this.otpCode).subscribe({
            next: (response) => {
                this.otpLoading = false;
                if (!response.valid) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Invalid authentication code.'
                    });
                    // remove current user from localStorage
                    this.authService.logout();
                    return;
                }
                this.otpDialogVisible = false;
                this.otpCode = '';
                this.otpLoading = false;
                const returnUrl = this.router.parseUrl(this.router.url).queryParams['returnUrl'] || '/dashboard';
                this.router.navigateByUrl(returnUrl);
            },
            error: () => {
                this.otpLoading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to verify authentication code.'
                });
                this.otpLoading = false;
                this.otpDialogVisible = false;
                this.otpCode = '';
            }
        });
    }
    onGoogleLogin(): void {

        this.loading = true;
        this.error = '';

        this.authService.googleLogin().subscribe({
            next: (result) => {
                console.log("result:", result);
                this.loading = false;
                window.location.href = result;
            },
            error: (error) => {

                this.error = '';
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error
                });
                this.loading = false;
            }
        });
    }
}
