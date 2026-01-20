import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
// import { AppleWidget } from '@/pages/auth/components/applewidget';
import { GoogleWidget } from '@/pages/auth/components/googlewidget';
import { LogoWidget } from '@/pages/components/landing/components/logowidget';
import { LazyImageWidget } from '@/pages/components/landing/components/lazyimagewidget';
import { AuthService } from '@/auth/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { InputOtpModule } from 'primeng/inputotp';
import { AddressService } from '@/service/address.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        LogoWidget,
        LazyImageWidget,
        GoogleWidget,
        // AppleWidget,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        CheckboxModule,
        DropdownModule,
        ToastModule,
        RouterLink,
        DialogModule,
        CommonModule,
        InputOtpModule
    ],
    templateUrl: './register.html',
    providers: [AuthService, MessageService]
})
export class Register {
    currentYear: number = new Date().getFullYear();
    registerForm: FormGroup;
    loading = false;
    showVerification = false;
    verificationCode = '';
    emailForVerification = '';
    showPassword: boolean = false;


    userTypes = [
        { label: 'Merchant', value: 'MERCHANT' },
        { label: 'Buyer', value: 'BUYER' },
        // { label: 'Courier', value: 'COURIER' }
    ];

    merchantTypes = [
        { label: 'Organic', value: 'ORGANIC' },
        { label: 'Conventional', value: 'CONVENTIONAL' },
        { label: 'Hydroponic', value: 'HYDROPONIC' },
        { label: 'Aquaponic', value: 'AQUAPONIC' }
    ];

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private authService: AuthService,
        private messageService: MessageService,
        private addressService: AddressService
    ) {
        // Pre-populate address
        const savedAddress = this.addressService.getAddress();
        const prefillAddress = savedAddress?.address || savedAddress?.street || '';
        
        this.registerForm = this.fb.group({
            username: ['test_user_001', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            fullName: ['', Validators.required],
            address: [prefillAddress, Validators.required],
            phoneNumber: ['', Validators.required],
            userType: ['', Validators.required],
            terms: [false, Validators.requiredTrue],

            // Merchant specific
            merchantEstablishedDate: [''],
            merchantType: [''],
            organicCertification: [false],

            // Buyer specific
            buyerName: [''],
            website: [''],

            // Courier specific
            vehicleType: [''],
            vehicleRegistrationNumber: [''],
            licenseNumber: ['']
        });
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }

    async onSubmit() {
        if (this.registerForm.invalid || !this.registerForm.value.terms) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill all required fields and accept the terms'
            });
            return;
        }
        
        // Save address to service for future pre-population
        if (this.registerForm.value.address) {
            this.addressService.updateAddress({
                address: this.registerForm.value.address
            });
        }

        // Add + prefix to phone number if not present
        let phoneNumber = this.registerForm.value.phoneNumber;
        if (phoneNumber && !phoneNumber.startsWith('+')) {
            phoneNumber = '+' + phoneNumber;
            this.registerForm.patchValue({ phoneNumber: phoneNumber });
        }

        this.loading = true;
        this.emailForVerification = phoneNumber;

        try {
            // First send verification code
            this.authService.sendVerificationCode(this.emailForVerification).subscribe({
                next: (response) => {
                    console.log(response);
                    this.showVerification = true;
                    },
                    error: (error) => {
                        console.error(error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: error || 'Failed to send verification code'
                        });
                        this.loading = false;
                    }
            });
        } catch (error: any) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.message ||  'Failed to send verification code'
            });
        } finally {
            this.loading = false;
        }
    }

    // register

    register() {
        const formData = this.registerForm.value;
        const registrationData = {
            ...formData,
            verificationCode: this.verificationCode
        };

        this.authService.register(registrationData).subscribe({
            next: (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Registration successful!'
                });
                this.router.navigate(['/dashboard']);
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Registration Failed',
                    detail: error.message || 'Registration failed. Please try again.'
                });
            }
        });   
    }
    async onVerify() {
        if (!this.verificationCode || this.verificationCode.length !== 6) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please enter a valid 6-digit code'
            });
            return;
        }

        this.loading = true;

        try {
            // Verify the code first
            this.authService.verifyCode(
                this.emailForVerification,
                this.verificationCode
            ).subscribe({
                next: (response) => {
                    console.log(response);
                    // add successfully message
                    
                    if (response) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Verification successful!'
                        })
                        this.showVerification = false;
                        this.register();
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Invalid verification code'
                        });
                        return;
                    }
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Invalid verification code'
                    });
                    return;
                }
            });


        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Verification failed'
            });
        } finally {
            this.loading = false;
        }
    }

    onGoogleLogin(): void {
        this.loading = true;

        this.authService.googleLogin().subscribe({
            next: (result) => {
                console.log("result:", result);
                this.loading = false;
                window.location.href = result;
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error
                });
                this.loading = false;
            }
        });
    }
    onAppleLogin() {
        this.loading = true;
        this.authService.appleLogin().subscribe({
            next: (user) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Apple login successful!'
                });
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Apple Login Failed',
                    detail: error.message || 'Failed to login with Apple'
                });
            }
        });
    }
}