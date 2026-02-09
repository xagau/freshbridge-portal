import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputOtpModule } from 'primeng/inputotp';

@Component({
    selector: 'app-verification-code-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, DialogModule, InputOtpModule],
    template: `
        <p-dialog [(visible)]="visible" [modal]="true" [style]="{ width: '450px' }" [closable]="false" (onHide)="onCancel()">
            <h5 class="title-h5 text-center">{{ title }}</h5>
            <p class="body-small mt-3.5 text-center">
                {{ message || defaultMessage }}
            </p>

            <div class="mt-6 flex items-center justify-center">
                <p-inputOtp
                    [(ngModel)]="code"
                    (ngModelChange)="codeChange.emit($event)"
                    [integerOnly]="true"
                    [length]="6">
                </p-inputOtp>
            </div>

            <div class="flex gap-4 mt-6">
                <button (click)="onCancel()" type="button"
                    class="body-button border border-surface-200 dark:border-surface-800 bg-transparent hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-950 dark:text-surface-0 flex-1">
                    Cancel
                </button>
                <button (click)="verify.emit()" type="button" class="body-button flex-1"
                    [disabled]="!code || code.length !== 6 || loading">
                    Verify
                </button>
            </div>

            <div class="text-center mt-4 body-small">
                Didn't receive code?
                <button (click)="resend.emit()" [disabled]="loading"
                    class="text-primary-500 hover:underline bg-transparent border-none cursor-pointer">
                    Resend
                </button>
            </div>
        </p-dialog>
    `
})
export class VerificationCodeModalComponent {
    @Input() visible = false;
    @Output() visibleChange = new EventEmitter<boolean>();

    @Input() title = 'Verification Code';
    @Input() message = '';
    @Input() targetLabel = '';
    @Input() loading = false;
    @Input() code = '';
    @Output() codeChange = new EventEmitter<string>();
    @Output() verify = new EventEmitter<void>();
    @Output() resend = new EventEmitter<void>();

    get defaultMessage() {
        return this.targetLabel
            ? `We've sent a 6-digit code to ${this.targetLabel}`
            : 'Enter the 6-digit verification code.';
    }

    onCancel() {
        this.visibleChange.emit(false);
    }
}
