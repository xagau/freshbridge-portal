import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { Select } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputOtpModule } from 'primeng/inputotp';
import { MessageService } from 'primeng/api';
import { AuthService } from '@/auth/auth.service';
import { QRCodeComponent } from 'angularx-qrcode';

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
        ToastModule,
        DialogModule,
        InputOtpModule,
        QRCodeComponent
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

        <div *ngIf="twoFaSetup.showSetup" class="mt-4 border border-surface-200 rounded-lg p-4">
            <p class="body-small mb-2">Scan this QR code with Google Authenticator, then enter the code below.</p>
            <qrcode [qrdata]="twoFaSetup.otpauthUri" [width]="160" [errorCorrectionLevel]="'M'"></qrcode>
            <p class="body-small mt-3">Secret: <span class="font-semibold">{{ twoFaSetup.secret }}</span></p>

            <input pInputText
                   placeholder="Enter 6-digit code"
                   [(ngModel)]="twoFaSetup.code"
                   class="w-full mt-3 mb-2" />
            <button pButton
                    label="Verify and Enable"
                    icon="pi pi-check"
                    (click)="confirmTwoFa()"
                    [disabled]="twoFaSetup.loading">
            </button>
        </div>
    </section>

    <p-divider></p-divider>

    <!-- Phone Verification -->
    <!-- <section>
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
    </section> -->


    <p-dialog [(visible)]="showVerification" [modal]="true" [style]="{ width: '450px' }" [closable]="false">
        <h5 class="title-h5 text-center">
            Email Verification Code
        </h5>
        <p class="body-small mt-3.5 text-center">
            We've sent a 6-digit code to {{ verificationTargetLabel }}
        </p>

        <div class="mt-6 flex items-center justify-center">
            <p-inputOtp [(ngModel)]="verificationCode" [integerOnly]="true" [length]="6"></p-inputOtp>
        </div>

        <div class="flex gap-4 mt-6">
            <button (click)="showVerification = false" type="button"
                class="body-button border border-surface-200 dark:border-surface-800 bg-transparent hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-950 dark:text-surface-0 flex-1">
                Cancel
            </button>
            <button (click)="onVerify()" type="button" class="body-button flex-1"
                [disabled]="!verificationCode || verificationCode.length !== 6 || verificationLoading">
                Verify
            </button>
        </div>

        <div class="text-center mt-4 body-small">
            Didn't receive code?
            <button (click)="sendVerificationCode()" [disabled]="verificationLoading"
                class="text-primary-500 hover:underline bg-transparent border-none cursor-pointer">
                Resend
            </button>
        </div>
    </p-dialog>
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

    showVerification = false;
    verificationCode = '';
    verificationTargetLabel = '';
    verificationContact = '';
    verificationLoading = false;

    security = {
        twoFaEnabled: false,
        twoFaMethod: ''
    };

    twoFaMethods = [
        // { name: 'SMS (Phone)', code: 'sms' },
        { name: 'Authenticator App', code: 'totp' }
    ];

    phone = {
        number: '',
        code: '',
        codeSent: false
    };

    twoFaSetup = {
        secret: '',
        otpauthUri: '',
        code: '',
        loading: false,
        showSetup: false
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
        if (!this.password.current) {
            this.message.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please enter your current password'
            });
            return;
        }
        if (this.password.new !== this.password.confirm) {
            this.message.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Passwords do not match'
            });
            return;
        }

        const user = this.authService.currentUserValue;
        if (!user) {
            this.message.add({
                severity: 'error',
                summary: 'Error',
                detail: 'User not found'
            });
            return;
        }

        this.saving = true;
        this.authService.verifyCurrentPassword(user.id, this.password.current).subscribe({
            next: (isValid) => {
                if (!isValid) {
                    this.message.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Current password is incorrect'
                    });
                    this.saving = false;
                    return;
                }
                this.saving = false;
                this.showVerification = true;
                this.verificationContact = user.email;
                this.verificationTargetLabel = user.email;
                this.sendVerificationCode();
            },
            error: (error) => {
                this.message.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error?.message || 'Failed to verify current password'
                });
                this.saving = false;
            }
        });
    }


    sendVerificationCode() {
        if (!this.verificationContact) {
            return;
        }
        this.verificationLoading = true;
        this.authService.sendVerificationCode(this.verificationContact).subscribe({
            next: () => {
                this.verificationCode = '';
                this.showVerification = true;
                this.verificationLoading = false;
            },
            error: (error) => {
                this.message.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error?.message || 'Failed to send verification code'
                });
                this.verificationLoading = false;
            }
        });
    }

    onVerify() {
        if (!this.verificationCode || this.verificationCode.length !== 6) {
            this.message.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please enter a valid 6-digit code'
            });
            return;
        }
        this.verificationLoading = true;
        this.authService.verifyCode(this.verificationContact, this.verificationCode).subscribe({
            next: (isValid) => {
                if (!isValid) {
                    this.message.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Invalid verification code'
                    });
                    this.verificationLoading = false;
                    return;
                }
                this.resetPasswordWithCode();
            },
            error: () => {
                this.message.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Invalid verification code'
                });
                this.verificationLoading = false;
            }
        });
    }

    private resetPasswordWithCode() {
        this.saving = true;
        this.authService.resetPassword(this.verificationContact, this.verificationCode, this.password.new).subscribe({
            next: () => {
                this.message.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Password updated successfully'
                });
                this.password = { current: '', new: '', confirm: '' };
                this.verificationCode = '';
                this.showVerification = false;
                this.saving = false;
                this.verificationLoading = false;
            },
            error: (error) => {
                this.message.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error?.message || 'Failed to reset password'
                });
                this.saving = false;
                this.verificationLoading = false;
            }
        });
    }

    toggle2fa() {
        const user = this.authService.currentUserValue;
        if (!user) {
            this.message.add({
                severity: 'error',
                summary: 'Error',
                detail: 'User not found'
            });
            return;
        }

        if (this.security.twoFaEnabled) {
            this.authService.disableTwoFa(user.id).subscribe({
                next: (updatedUser) => {
                    this.security.twoFaEnabled = false;
                    this.security.twoFaMethod = '';
                    this.twoFaSetup.showSetup = false;
                    this.authService.updateStoredUser(updatedUser);
                    this.message.add({
                        severity: 'success',
                        summary: '2FA Updated',
                        detail: 'Two-factor authentication disabled'
                    });
                },
                error: () => {
                    this.message.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to disable two-factor authentication'
                    });
                }
            });
            return;
        }

        if (!this.security.twoFaMethod) {
            this.message.add({
                severity: 'warn',
                summary: '2FA Method',
                detail: 'Select a 2FA method first'
            });
            return;
        }

        if (this.security.twoFaMethod === 'sms') {
            this.message.add({
                severity: 'info',
                summary: 'SMS 2FA',
                detail: 'SMS 2FA is not available yet'
            });
            return;
        }

        this.twoFaSetup.loading = true;
        this.authService.setupTwoFa(user.id, this.security.twoFaMethod).subscribe({
            next: (response) => {
                this.twoFaSetup.secret = response.secret;
                this.twoFaSetup.otpauthUri = response.otpauthUri;
                this.twoFaSetup.code = '';
                this.twoFaSetup.showSetup = true;
                this.twoFaSetup.loading = false;
            },
            error: () => {
                this.twoFaSetup.loading = false;
                this.message.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to initialize 2FA setup'
                });
            }
        });
    }

    confirmTwoFa() {
        const user = this.authService.currentUserValue;
        if (!user || !this.twoFaSetup.code) {
            return;
        }
        this.twoFaSetup.loading = true;
        this.authService.verifyTwoFa(user.id, this.twoFaSetup.code).subscribe({
            next: (updatedUser) => {
                this.security.twoFaEnabled = true;
                this.security.twoFaMethod = 'totp';
                this.twoFaSetup.showSetup = false;
                this.twoFaSetup.loading = false;
                this.authService.updateStoredUser(updatedUser);
                this.message.add({
                    severity: 'success',
                    summary: '2FA Enabled',
                    detail: 'Two-factor authentication enabled successfully'
                });
            },
            error: () => {
                this.twoFaSetup.loading = false;
                this.message.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Invalid authentication code'
                });
            }
        });
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
