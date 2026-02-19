import { Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';
import { InputText } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { RippleModule } from 'primeng/ripple';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';
import { AddressSearchResult, AddressService } from '@/service/address.service';
import { AuthService } from '@/auth/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { environment } from '../../../environments/environment';
import { AccountService } from '@/service/account.service';
import { Account } from '@/auth/interfaces/user.interface';

@Component({
    selector: 'profile-user',
    standalone: true,
    imports: [CommonModule, FormsModule, AutoComplete, InputText, TextareaModule, FileUploadModule, ButtonModule, InputGroupModule, RippleModule, DividerModule, ToastModule, DialogModule, ImageCropperComponent],
    template: `<div class="card">
        <div class="flex items-center justify-between mb-6">
            <span class="text-surface-900 dark:text-surface-0 text-xl font-bold">Profile</span>
            <button *ngIf="!isEditMode" pButton pRipple label="Edit" icon="pi pi-pencil" class="p-button-outlined" (click)="enterEditMode()"></button>
        </div>
        <p-toast></p-toast>
        <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 lg:col-span-10">
                <div class="grid grid-cols-12 gap-4">
                    <div class="mb-6 col-span-12">
                        <label for="nickname" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Full Name </label>
                        <input *ngIf="isEditMode" id="fullName" type="text" pInputText fluid [(ngModel)]="settings.fullName" />
                        <div *ngIf="!isEditMode" class="text-surface-700 dark:text-surface-300 py-2">{{ settings.fullName || 'Not set' }}</div>
                    </div>
                    <div class="mb-6 col-span-12 flex flex-col items-start">
                        <label for="avatar" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block">Avatar</label>
                        <!-- Set note for only png images are allowed  and size-->
                        <small class="text-surface-500 dark:text-surface-400 text-sm">Only PNG images are allowed and size must be less than 1MB</small>
                        <p-fileupload *ngIf="isEditMode" mode="basic" name="avatar" url="./upload.php" accept="image/*"
                            [maxFileSize]="1000000" styleClass="p-button-outlined p-button-plain" chooseLabel="Upload Avatar"
                            (onSelect)="onAvatarSelect($event)"></p-fileupload>
                        <img *ngIf="!isEditMode" [src]="avatarUrl" class="w-24 h-24 object-cover rounded-full"
                            (error)="setDefaultAvatar($event)" />
                        <img *ngIf="isEditMode" [src]="avatarUrl" class="w-24 h-24 object-cover rounded-full mt-3"
                            (error)="setDefaultAvatar($event)" />
                    </div>
                    <div class="mb-6 col-span-12 flex flex-col items-start">
                        <label for="banner" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block">Banner</label>
                        <p-fileupload *ngIf="isEditMode" mode="basic" name="banner" url="./upload.php" accept="image/*" [maxFileSize]="1000000" styleClass="p-button-outlined p-button-plain" chooseLabel="Upload Banner" (onSelect)="onBannerSelect($event)"></p-fileupload>
                        <img *ngIf="!isEditMode" [src]="bannerUrl" class="w-full h-40 object-cover rounded-lg" (error)="setDefaultBanner($event)" />
                    </div>
                    <div class="mb-6 col-span-12">
                        <label for="bio" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Bio </label>
                        <input *ngIf="isEditMode" pTextarea id="bio" type="text" rows="5" [autoResize]="true" fluid [(ngModel)]="settings.bio" />
                        <div *ngIf="!isEditMode" class="text-surface-700 dark:text-surface-300 py-2 whitespace-pre-line">{{ settings.bio || 'Not set' }}</div>
                    </div>
                    <div class="mb-6 col-span-12 md:col-span-6">
                        <label for="email" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Email </label>
                        <input *ngIf="isEditMode" id="email" name="email" type="email" pInputText fluid [(ngModel)]="settings.email"
                            (blur)="emailTouched = true" [class.p-invalid]="emailTouched && !isEmailValid()" />
                        <small *ngIf="isEditMode && emailTouched && !isEmailValid()" class="p-error block mt-1">Please enter a valid email address.</small>
                        <div *ngIf="!isEditMode" class="text-surface-700 dark:text-surface-300 py-2">{{ settings.email || 'Not set' }}</div>
                    </div>
                    <div class="mb-6 col-span-12 md:col-span-6">
                        <label for="role" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Role </label>
                        <!-- <p-select *ngIf="isEditMode" [options]="type" optionLabel="name" optionValue="code" placeholder="Select a Role" class="w-full md:w-56" [(ngModel)]="settings.role" /> -->
                        <div class="text-surface-700 dark:text-surface-300 py-2">{{ getRoleName(settings.role) || 'Not set' }}</div>
                    </div>
                    <div class="mb-6 col-span-12">
                        <label for="address" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Address </label>
                        <p-autocomplete
                            *ngIf="isEditMode"
                            inputId="address"
                            [suggestions]="addressSuggestions"
                            (completeMethod)="searchAddress($event)"
                            (onSelect)="onAddressSelect($event)"
                            (ngModelChange)="onAddressInputChange($event)"
                            [(ngModel)]="addressQuery"
                            field="display_name"
                            [minLength]="3"
                            styleClass="w-full"
                            inputStyleClass="w-full"
                            [forceSelection]="false"
                        ></p-autocomplete>
                        <div *ngIf="!isEditMode" class="text-surface-700 dark:text-surface-300 py-2">{{ settings.address || 'Not set' }}</div>
                    </div>
                    
                    <!-- <div class="mb-6 col-span-12">
                        <label for="website" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Website </label>
                        <p-inputgroup *ngIf="isEditMode">
                            <p-inputgroup-addon>
                                <span>www</span>
                            </p-inputgroup-addon>
                            <input id="website" type="text" pInputText fluid [(ngModel)]="settings.website" />
                        </p-inputgroup>
                        <div *ngIf="!isEditMode" class="text-surface-700 dark:text-surface-300 py-2">{{ settings.website ? 'www.' + settings.website : 'Not set' }}</div>
                    </div> -->
                    <div *ngIf="isEditMode" class="col-span-12 flex gap-3">
                        <button pButton pRipple label="Save Settings" icon="pi pi-check" class="w-auto mt-3" (click)="saveSettings()" [disabled]="saving"></button>
                        <button pButton pRipple label="Cancel" icon="pi pi-times" class="p-button-outlined w-auto mt-3" (click)="cancelEdit()" [disabled]="saving"></button>
                    </div>
                    
                    <div class="col-span-12">
                        <p-divider />
                    </div>
                    
                    <div class="col-span-12">
                        <span class="text-surface-900 dark:text-surface-0 text-lg font-bold mb-4 block">Banking Information</span>
                    </div>
                    
                    <div class="col-span-12 mb-6">
                        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
                            <i class="pi pi-info-circle text-blue-600 dark:text-blue-400 text-xl mt-0.5 flex-shrink-0"></i>
                            <div class="flex-1">
                                <h4 class="text-blue-900 dark:text-blue-100 font-semibold mb-2">Banking Information Disclaimer</h4>
                                <p class="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                                    Please ensure that all banking information provided is accurate and up-to-date. 
                                    FreshBridge uses bank-level encryption to protect your financial data. 
                                    By submitting your banking information, you acknowledge that you are authorized to provide 
                                    these details and that they will be used solely for payment processing purposes. 
                                    We are not responsible for any errors resulting from incorrect information provided.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-6 col-span-12 md:col-span-6">
                        <label for="bankName" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Bank Name </label>
                        <input *ngIf="isEditMode" id="bankName" type="text" pInputText fluid [(ngModel)]="settings.bankName" />
                        <div *ngIf="!isEditMode" class="text-surface-700 dark:text-surface-300 py-2">{{ settings.bankName || 'Not set' }}</div>
                    </div>
                    
                    <!-- <div class="mb-6 col-span-12 md:col-span-6">
                        <label for="accountHolderName" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Account Holder Name </label>
                        <input *ngIf="isEditMode" id="accountHolderName" type="text" pInputText fluid [(ngModel)]="settings.accountHolderName" />
                        <div *ngIf="!isEditMode" class="text-surface-700 dark:text-surface-300 py-2">{{ settings.accountHolderName || 'Not set' }}</div>
                    </div>
                     -->
                    <div class="mb-6 col-span-12 md:col-span-6">
                        <label for="accountNumber" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Account Number </label>
                        <input *ngIf="isEditMode" id="accountNumber" type="text" pInputText fluid [(ngModel)]="settings.accountNumber" />
                        <div *ngIf="!isEditMode" class="text-surface-700 dark:text-surface-300 py-2">{{ settings.accountNumber ? '••••••••' : 'Not set' }}</div>
                    </div>
<!--                     
                    <div class="mb-6 col-span-12 md:col-span-6">
                        <label for="accountType" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Account Type </label>
                        <p-select *ngIf="isEditMode" [options]="accountTypes" optionLabel="name" optionValue="code" placeholder="Select Account Type" class="w-full" [(ngModel)]="settings.accountType" />
                        <div *ngIf="!isEditMode" class="text-surface-700 dark:text-surface-300 py-2">{{ getAccountTypeName(settings.accountType) || 'Not set' }}</div>
                    </div>
                     -->
                    <div class="mb-6 col-span-12 md:col-span-6">
                        <label for="routingNumber" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Routing Number / SWIFT Code </label>
                        <input *ngIf="isEditMode" id="routingNumber" type="text" pInputText fluid [(ngModel)]="settings.routingNumber" />
                        <div *ngIf="!isEditMode" class="text-surface-700 dark:text-surface-300 py-2">{{ settings.routingNumber || 'Not set' }}</div>
                    </div>
                    
                    <!-- <div class="mb-6 col-span-12 md:col-span-6">
                        <label for="iban" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> IBAN (Optional) </label>
                        <input *ngIf="isEditMode" id="iban" type="text" pInputText fluid [(ngModel)]="settings.iban" />
                        <div *ngIf="!isEditMode" class="text-surface-700 dark:text-surface-300 py-2">{{ settings.iban || 'Not set' }}</div>
                    </div>
                     -->
                    <!-- <div class="mb-6 col-span-12">
                        <label for="bankAddress" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Bank Address </label>
                        <input *ngIf="isEditMode" pTextarea id="bankAddress" type="text" rows="3" [autoResize]="true" fluid [(ngModel)]="settings.bankAddress" />
                        <div *ngIf="!isEditMode" class="text-surface-700 dark:text-surface-300 py-2 whitespace-pre-line">{{ settings.bankAddress || 'Not set' }}</div>
                    </div> -->
                    
                    <div *ngIf="isEditMode" class="col-span-12 flex gap-3">
                        <button pButton pRipple label="Save Settings" icon="pi pi-check" class="w-auto mt-3" (click)="updateAccount()" [disabled]="saving"></button>
                        <button pButton pRipple label="Cancel" icon="pi pi-times" class="p-button-outlined w-auto mt-3" (click)="cancelEdit()" [disabled]="saving"></button>
                    </div>
                </div>
            </div>
        </div>

        <p-dialog [(visible)]="showAvatarCrop" [modal]="true" [closable]="false" width="100%" header="Crop Avatar">
            <image-cropper
                [imageBase64]="avatarCropBase64"
                output="blob"
                [maintainAspectRatio]="true"
                [aspectRatio]="1"
                [resizeToWidth]="256"
                [cropperMinWidth]="128"
                [cropperMinHeight]="128"
                [onlyScaleDown]="true"
                format="png"
                (imageCropped)="onAvatarCropped($event)">
            </image-cropper>
            <div class="flex gap-3 justify-end mt-4">
                <button pButton pRipple label="Cancel" class="p-button-outlined" (click)="cancelAvatarCrop()"></button>
                <button pButton pRipple label="Use Photo" (click)="confirmAvatarCrop()" [disabled]="!croppedAvatarBlob"></button>
            </div>
        </p-dialog>
    </div> `,
    providers: [MessageService]
})
export class ProfileUser implements OnInit {
    isEditMode: boolean = false;
    saving: boolean = false;
    countries: any[] = [];
    type: any[] = [];
    accountTypes: any[] = [];
    addressQuery: string = '';
    addressSuggestions: AddressSearchResult[] = [];
    selectedBanner: File | null = null;
    bannerUrl: string = '';
    selectedAvatar: File | null = null;
    avatarUrl: string = '';
    showAvatarCrop = false;
    avatarCropBase64 = '';
    croppedAvatarBlob: Blob | null = null;
    croppedAvatarUrl = '';
    pendingAvatarFileName = 'avatar.png';

    environment = environment;
    settings: any = {
        fullName: '',
        banner: '',
        bio: '',
        email: '',
        role: '',
        address: '',
        state: '',
        website: '',
        bankName: '',
        accountHolderName: '',
        accountNumber: '',
        accountType: '',
        routingNumber: '',
        iban: '',
        bankAddress: '',
        accountId: null,
    };

    originalSettings: any = {};
    emailTouched = false;
    /** RFC-style email pattern for validation */
    emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    constructor(
        private addressService: AddressService,
        private authService: AuthService,
        private messageService: MessageService,
        private accountService: AccountService,
        private zone: NgZone
    ) { }

    ngOnInit() {
        this.type = [
            { name: 'Merchant', code: 'merchant' },
            { name: 'Buyer', code: 'buyer' },
        ];

        this.accountTypes = [
            { name: 'Checking', code: 'checking' },
            { name: 'Savings', code: 'savings' },
            { name: 'Business Checking', code: 'business_checking' },
            { name: 'Business Savings', code: 'business_savings' }
        ];

        // Load user information
        this.loadUserSettings();
    }


    loadUserSettings() {
        // Load from AuthService
        const user = this.authService.currentUserValue;
        let account: Account | null = null;
        if (user) {
            this.settings.email = user.email || '';
            this.settings.role = user.role?.toLowerCase() || '';
            this.bannerUrl = environment.apiUrl + 'auth/banner/' + user.bannerUrl;
            this.avatarUrl = user.avatarUrl
                ? environment.apiUrl + 'auth/avatar/' + user.avatarUrl
                : (this.settings.role === 'merchant' ? 'images/avatar/merchant.png' : 'images/avatar/buyer.png');
            this.settings.fullName = user.fullName || '';
            this.settings.bio = user.bio || '';
            this.settings.address = user.address || '';
        }

        // TODO: Load banking info and other settings from API
        // For now, we'll keep the structure ready for API integration
        user?.id && this.accountService.getAccountByUserId(user.id).subscribe((account: Account) => {  
            console.log("account:", account);
            account && (this.settings.bankName = account.bankName || '',
            this.settings.accountId = account.id || null,
            this.settings.accountType = account.accountType || '',
            this.settings.accountNumber = account.accountNumber || '',
            this.settings.routingNumber = account.routingNumber || '');
        });

        // Store original settings for cancel functionality
        this.originalSettings = JSON.parse(JSON.stringify(this.settings));
        this.addressQuery = this.settings.address || '';
    }

    enterEditMode() {
        this.isEditMode = true;
        // Store current settings as original for cancel
        this.originalSettings = JSON.parse(JSON.stringify(this.settings));
        this.addressQuery = this.settings.address || '';
    }

    cancelEdit() {
        // Restore original settings
        this.settings = JSON.parse(JSON.stringify(this.originalSettings));
        this.isEditMode = false;
        this.emailTouched = false;
        this.addressQuery = this.settings.address || '';
        this.addressSuggestions = [];
        this.selectedBanner = null;
        this.selectedAvatar = null;
        this.showAvatarCrop = false;
        this.avatarCropBase64 = '';
        this.clearCroppedAvatar();
    }

    async saveSettings() {
        this.saving = true;
        let isInappropriate = false;
        const inappropriateWords = await fetch('/data/en.txt');
        const inappropriateWordsList = await inappropriateWords.text();
        inappropriateWordsList.split('\n').forEach(word => {
            if (this.settings.bio.toLowerCase().includes(word.toLowerCase())) {
                console.log(word.trim() === '');
                
                if (word.trim() !== '') {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Bio contains inappropriate language'
                    });
                    
                    isInappropriate = true;
                }
            }
        });

        if (isInappropriate) {
            this.saving = false;
            return;
        }

        const email = (this.settings.email || '').trim();
        if (!email || !this.emailPattern.test(email)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Please enter a valid email address.'
            });
            this.saving = false;
            return;
        }

        this.settings.address = this.addressQuery;
        const params = {
            bio: this.settings.bio,
            fullName: this.settings.fullName,
            address: this.settings.address,
        }
        if (this.selectedBanner) {
            this.authService.uploadBanner(this.selectedBanner).subscribe({
                next: (response: any) => {
                    console.log(response);
                    this.bannerUrl = environment.apiUrl + 'auth/banner/' + response.bannerUrl;
                },
                error: (error: any) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.message
                    });
                    return;
                }
            });
        }
        if (this.selectedAvatar) {
            this.authService.uploadAvatar(this.selectedAvatar).subscribe({
                next: (response: any) => {
                    if (response?.avatarUrl) {
                        this.clearCroppedAvatar();
                        this.avatarUrl = environment.apiUrl + 'auth/avatar/' + response.avatarUrl;
                    }
                },
                error: (error: any) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.message
                    });
                    return;
                }
            });
        }
        this.authService.updateUserSettings(params).subscribe({
            next: (response: any) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: response.message
                });
                setTimeout(() => {
                    this.saving = false;
                    this.isEditMode = false;
                    this.originalSettings = JSON.parse(JSON.stringify(this.settings));
                    this.addressQuery = this.settings.address || '';
                    this.addressSuggestions = [];
                    this.selectedBanner = null;
                    this.selectedAvatar = null;
                    this.showAvatarCrop = false;
                    this.avatarCropBase64 = '';
                    this.clearCroppedAvatar();
                }, 1000);
            },
            error: (error: any) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.message
                });
                setTimeout(() => {
                    this.saving = false;
                }, 1000);
            }
        });
    }

    async updateAccount() {
        this.saving = true;
        const account: Account = {
            id: this.settings.accountId,
            bankName: this.settings.bankName,
            accountType: this.settings.accountType,
            accountNumber: this.settings.accountNumber,
            routingNumber: this.settings.routingNumber,
            balance: 0,
            availableBalance: 0,
            transactions: [],
            bankTransfers: [],
            credits: [],
            createdAt: '',
            updatedAt: '',
            name: ''
        }
        if(this.settings.accountId == null  ) {
            const userId = this.authService.currentUserValue?.id || 0;
            this.accountService.createAccount(account, userId).subscribe({
                next: (response: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: "Account created successfully"
                    });
                    this.saving = false;
                    this.isEditMode = false;
                    this.loadUserSettings();
                },
                error: (error: any) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.message
                    });
                    this.saving = false;
                }
            });
        }
        else {
            this.accountService.updateAccount(account).subscribe({
                next: (response: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: "Account updated successfully"
                    });
                    this.saving = false;
                    this.isEditMode = false;
                    this.loadUserSettings();
                },
                error: (error: any) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.message
                    });
                    this.saving = false;
                }
            });
        }
            
    }
    isEmailValid(): boolean {
        const email = (this.settings.email || '').trim();
        return !!email && this.emailPattern.test(email);
    }

    getRoleName(roleCode: string): string {
        const role = this.type.find(r => r.code === roleCode);
        return role ? role.name : roleCode;
    }

    getAccountTypeName(accountTypeCode: string): string {
        const accountType = this.accountTypes.find(a => a.code === accountTypeCode);
        return accountType ? accountType.name : accountTypeCode;
    }

    onAddressInputChange(value: string) {
        this.settings.address = value || '';
    }

    async searchAddress(event: { query: string }) {
        const query = event?.query?.trim();
        if (!query) {
            this.addressSuggestions = [];
            return;
        }

        const results = await this.addressService.searchAddress(query, 5);
        this.zone.run(() => {
            this.addressSuggestions = results;
        });
    }

    onAddressSelect(event: { value?: AddressSearchResult }) {
        const selection = event?.value;
        if (!selection?.display_name) {
            return;
        }

        const state = this.addressService.extractState(selection);

        this.zone.run(() => {
            this.addressQuery = selection.display_name;
            this.settings.address = selection.display_name;
            if (state) {
                this.settings.state = state;
            }
        });
    }

    onBannerSelect(event: any) {
        this.selectedBanner = event.files[0];
    }

    onAvatarSelect(event: any) {
        const file = event.files?.[0];
        if (!file) {
            return;
        }
        if (!file.type?.startsWith('image/')) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please select a valid image file'
            });
            return;
        }
        this.pendingAvatarFileName = file.name || 'avatar.png';
        const reader = new FileReader();
        reader.onload = () => {
            this.avatarCropBase64 = String(reader.result || '');
            this.clearCroppedAvatar();
            this.showAvatarCrop = true;
        };
        reader.readAsDataURL(file);
    }

    setDefaultBanner(event: Event) {
        const img = event.target as HTMLImageElement;
        // Set your default image path here
        img.src = 'images/logo/banner.png';

        // Optional: Add a CSS class to style broken images differently
        img.classList.add('default-image');
    }

    setDefaultAvatar(event: Event) {
        const img = event.target as HTMLImageElement;
        if(this.settings.role === 'merchant') {
            img.src = 'images/avatar/merchant.png';
        } else {
            img.src = 'images/avatar/buyer.png';
        }
        img.classList.add('default-image');
    }

    onAvatarCropped(event: ImageCroppedEvent) {
        this.clearCroppedAvatar();
        if (event.blob) {
            // now is not correct with position
            console.log("event:", event);
            console.log("event.blob:", event.blob);
            console.log("event.objectUrl:", event.objectUrl);
            console.log("event.base64:", event.base64);
            console.log("event.width:", event.width);
            console.log("event.height:", event.height);
            // cropperPosition is not correct with position
            console.log("event.cropperPosition:", event.cropperPosition);
            this.croppedAvatarBlob = event.blob;
            this.croppedAvatarUrl = event.objectUrl || URL.createObjectURL(event.blob);
        }
    }

    confirmAvatarCrop() {
        if (!this.croppedAvatarBlob) {
            return;
        }
        this.selectedAvatar = new File([this.croppedAvatarBlob], this.pendingAvatarFileName, {
            type: this.croppedAvatarBlob.type || 'image/png'
        });
        if (this.croppedAvatarUrl) {
            this.avatarUrl = this.croppedAvatarUrl;
        }
        this.showAvatarCrop = false;
    }

    cancelAvatarCrop() {
        this.showAvatarCrop = false;
        this.avatarCropBase64 = '';
        this.selectedAvatar = null;
        this.clearCroppedAvatar();
    }

    private clearCroppedAvatar() {
        if (this.croppedAvatarUrl) {
            URL.revokeObjectURL(this.croppedAvatarUrl);
        }
        this.croppedAvatarUrl = '';
        this.croppedAvatarBlob = null;
    }
}
