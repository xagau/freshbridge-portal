import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { LogoWidget } from '@/pages/components/landing/components/logowidget';
import { LazyImageWidget } from '@/pages/components/landing/components/lazyimagewidget';
import { AuthService } from '@/auth/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-new-password',
    imports: [CommonModule, LogoWidget, RouterLink, ReactiveFormsModule, InputTextModule, LazyImageWidget, ToastModule],
    standalone: true,
    providers: [AuthService, MessageService],
    template: ` <section 
    class="min-h-screen flex items-center lg:items-start lg:py-20 justify-center animate-fadein animate-duration-300 animate-ease-in max-w-[100rem] mx-auto bg-[url('/images/landing/auth-image.png')] bg-cover bg-center bg-no-repeat lg:bg-none">
    <p-toast></p-toast>
        <div class="flex w-full h-full justify-center gap-12">
            <div class="flex flex-col py-20 lg:min-w-[30rem]">
                <a routerLink="/" class="flex items-center justify-center lg:justify-start mb-8">
                    <logo-widget></logo-widget>
                </a>
                <div class="flex flex-col justify-center flex-grow">
                    <div class="max-w-md mx-auto w-full">
                        <h5 class="title-h5 text-center lg:text-left">Create a new password</h5>
                        <p class="body-small mt-3.5 text-center lg:text-left">Enter your reset code and choose a new password</p>
                        <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()">
                            <input pInputText formControlName="contact" type="text" class="w-full mt-7" placeholder="Email or Phone" />
                            <input pInputText formControlName="resetCode" type="text" class="w-full mt-4" placeholder="Reset Code" />
                            <input pInputText formControlName="password" type="password" class="w-full mt-4" placeholder="Password" />
                            <input pInputText formControlName="repeatPassword" type="password" class="w-full mt-4" placeholder="Repeat Password" />

                            <div class="flex items-center gap-4 mt-8">
                                <button type="button" (click)="goToLogin()" class="body-button border border-surface-200 dark:border-surface-800 bg-transparent hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-950 dark:text-surface-0 flex-1">Cancel</button>
                                <button type="submit" class="body-button flex-1" [disabled]="passwordForm.invalid || loading">
                                    <span *ngIf="!loading">Submit</span>
                                    <span *ngIf="loading">Submitting...</span>
                                </button>
                            </div>
                        </form>
                        <div class="mt-8 body-small text-center lg:text-left">A problem? <a class="underline cursor-pointer hover:opacity-75 transition-all">Click here</a> and let us help you.</div>
                    </div>
                </div>
                <div class="mt-8 text-center lg:text-start block relative text-surface-400 dark:text-surface-500 text-sm">©{{ currentYear }} FreshBridge</div>
            </div>
            <div class="hidden lg:flex h-full py-20">
                <div class="h-full w-full lg:max-w-[32.5rem] xl:max-w-[60.5rem] mx-auto flex items-center justify-center shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)] rounded-3xl border border-surface overflow-hidden">
                    <app-lazy-image-widget className="w-auto h-[500px] xl:h-[650px]  object-contain object-left" src="/images/landing/auth-image.png" alt="Auth Image" />
                </div>
            </div>
        </div>
    </section>`
})
export class NewPassword {
    currentYear: number = new Date().getFullYear();
    passwordForm: FormGroup;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        const contact = this.route.snapshot.queryParamMap.get('contact') || '';
        this.passwordForm = this.fb.group({
            contact: [contact, [Validators.required]],
            resetCode: ['', [Validators.required, Validators.minLength(6)]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            repeatPassword: ['', [Validators.required]]
        });
    }

    onSubmit() {
        if (this.passwordForm.invalid || this.loading) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please complete all fields'
            });
            return;
        }

        const { contact, resetCode, password, repeatPassword } = this.passwordForm.value;
        if (password !== repeatPassword) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Passwords do not match'
            });
            return;
        }

        this.loading = true;
        this.authService.resetPassword(contact!, resetCode!, password!).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Password updated. Please sign in.'
                });
                // after some time, navigate to login page
                setTimeout(() => {
                    this.router.navigate(['/auth/login']);
                }, 3000);
                this.loading = false;
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error?.message || 'Failed to reset password'
                });
                this.loading = false;
            }
        });
    }

    goToLogin() {
        this.router.navigate(['/auth/login']);
    }
}
