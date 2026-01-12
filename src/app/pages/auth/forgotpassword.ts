import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { LazyImageWidget } from '@/pages/components/landing/components/lazyimagewidget';
import { LogoWidget } from '@/pages/components/landing/components/logowidget';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'app-forgot-password',
    imports: [InputTextModule, LazyImageWidget, LogoWidget, ReactiveFormsModule, RouterModule],
    standalone: true,
    template: `
        <section class="min-h-screen flex items-center lg:items-start lg:py-20 justify-center animate-fadein animate-duration-300 animate-ease-in max-w-[100rem] mx-auto">
            <div class="flex w-full h-full justify-center gap-12">
                <div class="flex flex-col py-20 lg:min-w-[30rem]">
                    <a [routerLink]="['/']" class="flex items-center justify-center lg:justify-start mb-8">
                        <logo-widget />
                    </a>
                    <div class="flex flex-col justify-center flex-grow">
                        <div class="max-w-md mx-auto w-full">
                            <h5 class="title-h5 text-center lg:text-left">Forgot Password</h5>
                            <p class="body-small mt-3.5 text-center lg:text-left">Enter your email to reset your password</p>
                            <form>
                                <input pInputText type="text" [formControl]="emailControl" class="w-full mt-7" placeholder="Email" />
                                <div class="flex items-center gap-4 mt-8">
                                    <button type="button" (click)="goHome()" class="body-button border border-surface-200 dark:border-surface-800 bg-transparent hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-950 dark:text-surface-0 flex-1">Cancel</button>
                                    <button type="submit" class="body-button flex-1">Submit</button>
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
                        <app-lazy-image-widget class="w-auto h-full object-contain object-left" src="/images/landing/auth-image.png" alt="Auth Image" />
                    </div>
                </div>
            </div>
        </section>
    `
})
export class ForgotPassword {
    currentYear: number = new Date().getFullYear();

    emailControl = new FormControl('');

    constructor(private router: Router, private location: Location) {}

    goHome() {
        this.location.back();
    }
}
