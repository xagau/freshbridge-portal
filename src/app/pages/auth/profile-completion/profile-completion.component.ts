import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@/auth/auth.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { LogoWidget } from '@/pages/components/landing/components/logowidget';

@Component({
    selector: 'app-profile-completion',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        DropdownModule,
        CheckboxModule,
        LogoWidget
    ],
    templateUrl: './profile-completion.component.html',
    providers: [MessageService]
})
export class ProfileCompletionComponent implements OnInit {
    userId: number = 0;
    profileForm: FormGroup;
    loading = false;
    currentYear = new Date().getFullYear();

    userTypes = [
        { label: 'Farmer', value: 'FARMER' },
        { label: 'Restaurant', value: 'RESTAURANT' },
        { label: 'Courier', value: 'COURIER' }
    ];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private authService: AuthService,
        private messageService: MessageService
    ) {
        this.profileForm = this.fb.group({
            userType: ['', Validators.required],
            phoneNumber: ['', Validators.required],

            // Farmer specific
            farmEstablishedDate: [''],
            farmType: [''],
            organicCertification: [false],

            // Restaurant specific
            restaurantName: [''],
            website: [''],

            // Courier specific
            vehicleType: [''],
            vehicleRegistrationNumber: [''],
            licenseNumber: ['']
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.userId = params['userId'];
            console.log('User ID:', this.userId);
            // Use the userId as needed
        });
    }

    onSubmit() {
        if (this.profileForm.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill all required fields'
            });
            return;
        }

        this.loading = true;

        const formData = {
            userType: this.profileForm.value.userType,
            phoneNumber: this.profileForm.value.phoneNumber,
            ...(this.profileForm.value.userType === 'FARMER' && {
                farmEstablishedDate: this.profileForm.value.farmEstablishedDate,
                farmType: this.profileForm.value.farmType,
                organicCertification: this.profileForm.value.organicCertification
            }),
            ...(this.profileForm.value.userType === 'RESTAURANT' && {
                restaurantName: this.profileForm.value.restaurantName,
                website: this.profileForm.value.website
            }),
            ...(this.profileForm.value.userType === 'COURIER' && {
                vehicleType: this.profileForm.value.vehicleType,
                vehicleRegistrationNumber: this.profileForm.value.vehicleRegistrationNumber,
                licenseNumber: this.profileForm.value.licenseNumber
            })
        };

        this.authService.completeRegistration(this.userId, formData).subscribe({
            next: (user) => {
                console.log(user);
                console.log('Profile completed successfully!');
                this.loading = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Profile completed successfully!'
                });
                setTimeout(() => {
                    this.router.navigate(['/dashboard']);
                }, 1000);
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.message || 'Failed to complete profile'
                });
            }
        });
    }
}