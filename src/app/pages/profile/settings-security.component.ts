import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { Select } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '@/auth/auth.service';

@Component({
    selector: 'settings-security',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        InputText,
        DividerModule,
        Select,
        ToastModule
    ],
    providers: [MessageService],
    template: `
<div class="card max-w-3xl">
    <h2 class="text-xl font-bold mb-4">Security Settings</h2>
    <p-toast></p-toast>

    <!-- Change Password -->
    <section class="mb-6">
        <h3 class="font-semibold mb-3">Change Password</h3>

        <div class="grid gap-3">
            <input pInputText type="password" placeholder="Current password"
                   [(ngModel)]="password.current" />
            <input pInputText type="password" placeholder="New password"
                   [(ngModel)]="password.new" />
            <input pInputText type="password" placeholder="Confirm new password"
                   [(ngModel)]="password.confirm" />
        </div>

        <button pButton class="mt-3"
                label="Update Password"
                icon="pi pi-lock"
                (click)="changePassword()"
                [disabled]="saving">
        </button>
    </section>

    <p-divider></p-divider>

    <!-- Two-Factor Authentication -->
    <section class="mb-6">
        <h3 class="font-semibold mb-3">Two-Factor Authentication (2FA)</h3>

        <div class="flex items-center justify-between mb-3">
            <span>Status:</span>
            <span class="font-semibold"
                  [class.text-green-600]="security.twoFaEnabled"
                  [class.text-red-500]="!security.twoFaEnabled">
                {{ security.twoFaEnabled ? 'Enabled' : 'Disabled' }}
            </span>
        </div>

        <p-select
            [options]="twoFaMethods"
            optionLabel="name"
            optionValue="code"
            [(ngModel)]="security.twoFaMethod"
            placeholder="Select 2FA method"
            class="w-full mb-3"
            [disabled]="security.twoFaEnabled">
        </p-select>

        <button pButton
                [label]="security.twoFaEnabled ? 'Disable 2FA' : 'Enable 2FA'"
                icon="pi pi-shield"
                (click)="toggle2fa()">
        </button>
    </section>

    <p-divider></p-divider>

    <!-- Phone Verification -->
    <section>
        <h3 class="font-semibold mb-3">Phone Verification</h3>

        <input pInputText
               placeholder="Phone number"
               [(ngModel)]="phone.number"
               class="w-full mb-2" />

        <button pButton
                label="Send Verification Code"
                icon="pi pi-send"
                (click)="sendPhoneCode()"
                class="mb-3">
        </button>

        <input *ngIf="phone.codeSent"
               pInputText
               placeholder="Enter verification code"
               [(ngModel)]="phone.code"
               class="w-full mb-2" />

        <button *ngIf="phone.codeSent"
                pButton
                label="Verify Phone"
                icon="pi pi-check"
                (click)="verifyPhone()">
        </button>
    </section>
</div>
`
})
export class SettingsSecurityComponent implements OnInit {

    saving = false;

    password = {
        current: '',
        new: '',
        confirm: ''
    };

    security = {
        twoFaEnabled: false,
        twoFaMethod: ''
    };

    twoFaMethods = [
        { name: 'SMS (Phone)', code: 'sms' },
        { name: 'Authenticator App', code: 'totp' }
    ];

    phone = {
        number: '',
        code: '',
        codeSent: false
    };

    constructor(
        private authService: AuthService,
        private message: MessageService
    ) {}

    ngOnInit() {
        const user = this.authService.currentUserValue;
        this.security.twoFaEnabled = !!user?.twoFaEnabled;
        this.security.twoFaMethod = user?.twoFaMethod || '';
        this.phone.number = user?.phone || '';
    }

    changePassword() {
        if (this.password.new !== this.password.confirm) {
            this.message.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Passwords do not match'
            });
            return;
        }

        this.saving = true;

        // TODO: API call
        setTimeout(() => {
            this.saving = false;
            this.password = { current: '', new: '', confirm: '' };

            this.message.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Password updated successfully'
            });
        }, 600);
    }

    toggle2fa() {
        this.security.twoFaEnabled = !this.security.twoFaEnabled;

        this.message.add({
            severity: 'success',
            summary: '2FA Updated',
            detail: this.security.twoFaEnabled
                ? 'Two-factor authentication enabled'
                : 'Two-factor authentication disabled'
        });

        // TODO: API update
    }

    sendPhoneCode() {
        this.phone.codeSent = true;

        this.message.add({
            severity: 'info',
            summary: 'Verification Sent',
            detail: 'SMS verification code sent'
        });

        // TODO: backend SMS call
    }

    verifyPhone() {
        this.phone.codeSent = false;
        this.phone.code = '';

        this.message.add({
            severity: 'success',
            summary: 'Verified',
            detail: 'Phone number verified successfully'
        });

        // TODO: backend verify
    }
}
