import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { LazyImageWidget } from '@/pages/components/landing/components/lazyimagewidget';
import { LogoWidget } from '@/pages/components/landing/components/logowidget';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '@/auth/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-forgot-password',
    imports: [CommonModule, InputTextModule, LazyImageWidget, LogoWidget, ReactiveFormsModule, RouterModule, ToastModule],
    providers: [AuthService, MessageService],
    standalone: true,
    template: `
        <p-toast></p-toast>
        <section 
    class="min-h-screen flex items-center lg:items-start lg:py-20 justify-center animate-fadein animate-duration-300 animate-ease-in max-w-[100rem] mx-auto bg-[url('/images/landing/auth-image.png')] bg-cover bg-center bg-no-repeat lg:bg-none">
            <div class="flex w-full h-full justify-center gap-12">
                <div class="flex flex-col p-20 min-w-[20rem] lg:min-w-[40rem] bg-yellow-100 bg-opacity-70 rounded-3xl dark:bg-gray-800 xl:bg-transparent">
                    <a [routerLink]="['/']" class="flex items-center justify-center lg:justify-start mb-8">
                        <logo-widget />
                    </a>
                    <div class="flex flex-col justify-center flex-grow">
                        <div class="max-w-md mx-auto w-full">
                            <h5 class="title-h5 text-center lg:text-left">Forgot Password</h5>
                            <p class="body-small mt-3.5 text-center lg:text-left">Enter your email to reset your password</p>
                            <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()">
                                <input pInputText type="text" formControlName="email" class="w-full mt-7" placeholder="Email" />
                                <div class="flex items-center gap-4 mt-8">
                                    <button type="button" (click)="goHome()" class="body-button border border-surface-200 dark:border-surface-800 bg-transparent hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-950 dark:text-surface-0 flex-1">Cancel</button>
                                    <button type="submit" class="body-button flex-1" [disabled]="forgotForm.invalid || loading">
                                        <span *ngIf="!loading">Submit</span>
                                        <span *ngIf="loading">Submitting...</span>
                                    </button>
                                </div>
                            </form>
                            <div class="mt-8 body-small text-center lg:text-left">
                              A problem? <a [routerLink]="['/contact']" class="underline cursor-pointer hover:opacity-75 transition-all">Click here</a> and let us help you.
                            </div>
                        </div>
                    </div>
                    <div class="mt-8 text-center lg:text-start block relative text-surface-400 dark:text-surface-500 text-sm">©{{ currentYear }} FreshBridge</div>
                </div>
                <div class="hidden lg:flex h-full py-20">
                    <div class="h-full w-full lg:max-w-[32.5rem] xl:max-w-[60.5rem] mx-auto flex items-center justify-center shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)] rounded-3xl border border-surface overflow-hidden">
                        <app-lazy-image-widget className="w-auto h-[500px] xl:h-[650px]  object-contain object-left"
                        src="/images/landing/auth-image.png" alt="Auth Image" />
                    </div>
                </div>
            </div>
        </section>
    `
})
export class ForgotPassword {
    currentYear: number = new Date().getFullYear();
    loading = false;
    forgotForm: FormGroup;

    constructor(
        private router: Router,
        private location: Location,
        private fb: FormBuilder,
        private authService: AuthService,
        private messageService: MessageService
    ) {
        this.forgotForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    onSubmit() {
        if (this.forgotForm.invalid || this.loading) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please enter a valid email address'
            });
            return;
        }

        this.loading = true;
        const { email } = this.forgotForm.value;

        this.authService.forgotPassword(email!).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Check your email',
                    detail: 'If an account exists, a reset code has been sent.'
                });
                setTimeout(() => {
                    this.router.navigate(['/auth/new-password'], { queryParams: { contact: email } });
                    this.loading = false;
                }, 1000);
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error?.message || 'Failed to send reset code'
                });
                this.loading = false;
            }
        });
    }

    goHome() {
        this.location.back();
    }
}
