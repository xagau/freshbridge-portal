import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { RippleModule } from 'primeng/ripple';
import { DividerModule } from 'primeng/divider';
import { AddressService } from '@/service/address.service';

@Component({
    selector: 'settings-user',
    standalone: true,
    imports: [CommonModule, FormsModule, Select, InputText, TextareaModule, FileUploadModule, InputGroupAddon, ButtonModule, InputGroupModule, RippleModule, DividerModule],
    template: `<div class="card">
        <span class="text-surface-900 dark:text-surface-0 text-xl font-bold mb-6 block">Settings</span>
        <div class="grid grid-cols-12 gap-4">
            
            <div class="col-span-12 lg:col-span-10">
                <div class="grid grid-cols-12 gap-4">
                    <div class="mb-6 col-span-12">
                        <label for="nickname" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Nickname </label>
                        <input id="nickname" type="text" pInputText fluid />
                    </div>
                    <div class="mb-6 col-span-12 flex flex-col items-start">
                        <label for="avatar" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block">Avatar</label>
                        <p-fileupload mode="basic" name="avatar" url="./upload.php" accept="image/*" [maxFileSize]="1000000" styleClass="p-button-outlined p-button-plain" chooseLabel="Upload Image"></p-fileupload>
                    </div>
                    <div class="mb-6 col-span-12">
                        <label for="bio" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Bio </label>
                        <input pTextarea id="bio" type="text" rows="5" [autoResize]="true" fluid />
                    </div>
                    <div class="mb-6 col-span-12 md:col-span-6">
                        <label for="email" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Email </label>
                        <input id="email" type="text" pInputText fluid />
                    </div>
                     <div class="mb-6 col-span-12 md:col-span-6">
                        <label for="country" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Role </label>
                        <p-select [options]="type" optionLabel="name" placeholder="Select a Role" class="w-full md:w-56" />
                    </div>
                  
                    <div class="mb-6 col-span-12 md:col-span-6">
                        <label for="address" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Address </label>
                        <input id="address" type="text" pInputText fluid [(ngModel)]="userAddress.address" (blur)="saveAddress()" />
                    </div>
                    <div class="mb-6 col-span-12 md:col-span-6">
                        <label for="state" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> State </label>
                        <input id="state" type="text" pInputText fluid [(ngModel)]="userAddress.state" (blur)="saveAddress()" />
                    </div>
                    <div class="mb-6 col-span-12">
                        <label for="website" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Website </label>
                        <p-inputgroup>
                            <p-inputgroup-addon>
                                <span>www</span>
                            </p-inputgroup-addon>
                            <input id="website" type="text" pInputText fluid />
                        </p-inputgroup>
                    </div>
                    
                    <div class="col-span-12">
                        <p-divider />
                    </div>
                    
                    <div class="col-span-12">
                        <span class="text-surface-900 dark:text-surface-0 text-lg font-bold mb-4 block">Banking Information</span>
                    </div>
                    
                    <div class="mb-6 col-span-12 md:col-span-6">
                        <label for="bankName" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Bank Name </label>
                        <input id="bankName" type="text" pInputText fluid [(ngModel)]="bankingInfo.bankName" />
                    </div>
                    
                    <div class="mb-6 col-span-12 md:col-span-6">
                        <label for="accountHolderName" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Account Holder Name </label>
                        <input id="accountHolderName" type="text" pInputText fluid [(ngModel)]="bankingInfo.accountHolderName" />
                    </div>
                    
                    <div class="mb-6 col-span-12 md:col-span-6">
                        <label for="accountNumber" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Account Number </label>
                        <input id="accountNumber" type="text" pInputText fluid [(ngModel)]="bankingInfo.accountNumber" />
                    </div>
                    
                    <div class="mb-6 col-span-12 md:col-span-6">
                        <label for="accountType" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Account Type </label>
                        <p-select [options]="accountTypes" optionLabel="name" optionValue="code" placeholder="Select Account Type" class="w-full" [(ngModel)]="bankingInfo.accountType" />
                    </div>
                    
                    <div class="mb-6 col-span-12 md:col-span-6">
                        <label for="routingNumber" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Routing Number / SWIFT Code </label>
                        <input id="routingNumber" type="text" pInputText fluid [(ngModel)]="bankingInfo.routingNumber" />
                    </div>
                    
                    <div class="mb-6 col-span-12 md:col-span-6">
                        <label for="iban" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> IBAN (Optional) </label>
                        <input id="iban" type="text" pInputText fluid [(ngModel)]="bankingInfo.iban" />
                    </div>
                    
                    <div class="mb-6 col-span-12">
                        <label for="bankAddress" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Bank Address </label>
                        <input pTextarea id="bankAddress" type="text" rows="3" [autoResize]="true" fluid [(ngModel)]="bankingInfo.bankAddress" />
                    </div>
                    
                    <div class="col-span-12">
                        <button pButton pRipple label="Save Settings" class="w-auto mt-3"></button>
                    </div>
                </div>
            </div>
        </div>
    </div> `
})
export class SettingsUser implements OnInit {
    countries: any[] = [];
    type: any[] = [];
    accountTypes: any[] = [];
    
    userAddress: any = {
        address: '',
        state: ''
    };
    
    bankingInfo: any = {
        bankName: '',
        accountHolderName: '',
        accountNumber: '',
        accountType: '',
        routingNumber: '',
        iban: '',
        bankAddress: ''
    };
    
    constructor(private addressService: AddressService) {}
    
    ngOnInit() {
        this.type = [
            { name: 'Farmer', code: 'farmer' },
            { name: 'Food Buyer', code: ' food_buyer' },
            { name: 'Guest', code: 'guest' }
        ];
        
        this.accountTypes = [
            { name: 'Checking', code: 'checking' },
            { name: 'Savings', code: 'savings' },
            { name: 'Business Checking', code: 'business_checking' },
            { name: 'Business Savings', code: 'business_savings' }
        ];
        
        // Load pre-populated address
        this.loadAddress();
    }
    
    loadAddress() {
        const savedAddress = this.addressService.getAddress();
        if (savedAddress) {
            this.userAddress.address = savedAddress.address || savedAddress.street || '';
            this.userAddress.state = savedAddress.state || '';
        }
    }
    
    saveAddress() {
        this.addressService.updateAddress({
            address: this.userAddress.address,
            state: this.userAddress.state
        });
    }
}
