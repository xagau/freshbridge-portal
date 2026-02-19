import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { LazyImageWidget } from '@/pages/components/landing/components/lazyimagewidget';
import { LogoWidget } from '@/pages/components/landing/components/logowidget';
import { AuthService } from '@/auth/auth.service';
import { AccountService } from '@/service/account.service';
import { Account } from '@/auth/interfaces/user.interface';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-create-account',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        RouterLink,
        ToastModule,
        LogoWidget,
        LazyImageWidget
    ],
    providers: [MessageService],
    templateUrl: './create-account.component.html'
})
export class CreateAccountComponent implements OnInit {
    form: FormGroup;
    currentYear = new Date().getFullYear();
    loading = false;
    private returnUrl = '/dashboard';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private accountService: AccountService,
        private router: Router,
        private route: ActivatedRoute,
        private messageService: MessageService
    ) {
        this.form = this.fb.group({
            bankName: ['', [Validators.required]],
            accountNumber: ['', [Validators.required]],
            routingNumber: ['', [Validators.required]],
            accountType: ['checking'],
            name: ['']
        });
    }

    ngOnInit() {
        const user = this.authService.currentUserValue;
        if (!user) {
            this.router.navigate(['/auth/login'], {
                queryParams: { returnUrl: this.router.url }
            });
            return;
        }
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    }

    onSubmit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const user = this.authService.currentUserValue;
        if (!user?.id) {
            this.router.navigate(['/auth/login']);
            return;
        }

        this.loading = true;
        const value = this.form.value;
        const account: Account = {
            id: 0,
            bankName: value.bankName,
            accountNumber: value.accountNumber,
            routingNumber: value.routingNumber,
            accountType: value.accountType || 'checking',
            name: value.name || '',
            balance: 0,
            availableBalance: 0,
            transactions: [],
            bankTransfers: [],
            credits: [],
            createdAt: '',
            updatedAt: ''
        };

        this.accountService.createAccount(account, user.id).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Account created successfully. You can now add transactions.'
                });
                this.loading = false;
                this.router.navigateByUrl(this.returnUrl);
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err?.error?.message || err?.message || 'Failed to create account.'
                });
                this.loading = false;
            }
        });
    }
}
