import { Component } from '@angular/core';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'settings-user',
    standalone: true,
    imports: [Select, InputText, TextareaModule, FileUploadModule, InputGroupAddon, ButtonModule, InputGroupModule, RippleModule],
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
                        <label for="city" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Address </label>
                        <input id="city" type="text" pInputText fluid />
                    </div>
                    <div class="mb-6 col-span-12 md:col-span-6">
                        <label for="state" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> State </label>
                        <input id="state" type="text" pInputText fluid />
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
export class SettingsUser {
    countries: any[] = [];
    type: any[] = [];
    ngOnInit() {
        this.type = [
            { name: 'Farmer', code: 'farmer' },
            { name: 'Food Buyer', code: ' food_buyer' },
            { name: 'Guest', code: 'guest' }
        ];
    }
}
