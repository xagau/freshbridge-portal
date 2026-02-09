import { Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { AutoComplete } from 'primeng/autocomplete';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { RippleModule } from 'primeng/ripple';
import { AddressSearchResult, AddressService } from '@/service/address.service';

@Component({
    selector: 'user-create',
    standalone: true,
    imports: [CommonModule, FormsModule, Select, AutoComplete, InputText, TextareaModule, FileUploadModule, InputGroupAddon, ButtonModule, InputGroupModule, RippleModule],
    template: `<div class="card">
        <span class="text-surface-900 dark:text-surface-0 text-xl font-bold mb-6 block">Create User</span>
        <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 lg:col-span-2">
                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl mb-4">Profile</div>
                <p class="m-0 p-0 text-surface-600 dark:text-surface-200 leading-normal mr-4">Odio euismod lacinia at quis risus sed vulputate odio.</p>
            </div>
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
                  
                    <div class="mb-6 col-span-12">
                        <label for="address" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Address </label>
                        <p-autocomplete
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
                    </div>

                    <div class="mb-6 col-span-12 md:col-span-6">
                        <label for="city" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> City </label>
                        <input id="city" type="text" pInputText fluid [(ngModel)]="userAddress.city" />
                    </div>
                    <div class="mb-6 col-span-12 md:col-span-6">
                        <label for="state" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> State </label>
                        <input id="state" type="text" pInputText fluid [(ngModel)]="userAddress.state" />
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
                        <button pButton pRipple label="Create User" class="w-auto mt-3"></button>
                    </div>
                </div>
            </div>
        </div>
    </div> `
})
export class UserCreate implements OnInit {
    countries: any[] = [];
    type: any[] = [];
    
    userAddress: any = {
        address: '',
        city: '',
        state: ''
    };

    addressQuery: string = '';
    addressSuggestions: AddressSearchResult[] = [];
    
    constructor(private addressService: AddressService, private zone: NgZone) {}
    
    ngOnInit() {
        this.countries = [
            { name: 'Australia', code: 'AU' },
            { name: 'Brazil', code: 'BR' },
            { name: 'China', code: 'CN' },
            { name: 'Egypt', code: 'EG' },
            { name: 'France', code: 'FR' },
            { name: 'Germany', code: 'DE' },
            { name: 'India', code: 'IN' },
            { name: 'Japan', code: 'JP' },
            { name: 'Spain', code: 'ES' },
            { name: 'United States', code: 'US' }
        ];
        this.type = [
            { name: 'Merchant', code: 'merchant' },
            { name: 'Buyer', code: 'buyer' },
        ];
    }

    onAddressInputChange(value: string) {
        this.addressQuery = value || '';
        this.userAddress.address = value || '';
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
        const city = this.addressService.extractCity(selection);

        this.zone.run(() => {
            this.addressQuery = selection.display_name;
            this.userAddress.address = selection.display_name;
            if (city) {
                this.userAddress.city = city;
            }
            if (state) {
                this.userAddress.state = state;
            }
            this.addressSuggestions = [];
        });
    }

}
