import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { Customer } from '@/service/customer.service';

@Component({
    selector: 'app-user-info-dialog',
    standalone: true,
    imports: [
        CommonModule,
        AvatarModule,
        ButtonModule,
        DialogModule,
        DividerModule,
        TagModule
    ],
    template: `
        <p-dialog 
            header="User Information" 
            [(visible)]="visible" 
            [style]="{ width: '40vw' }" 
            [modal]="true"
            [draggable]="false" 
            [resizable]="false"
            (onHide)="onHide()">
            
            <div class="grid grid-cols-12 gap-4 p-4">
                <!-- User Avatar and Basic Info -->
                <div class="col-span-12 flex items-center gap-4">
                    <p-avatar 
                        [label]="getInitials(user?.name)" 
                        size="xlarge"
                        [style]="{'background-color': getStableColor(user?.id), 'color': '#ffffff'}"
                        shape="circle">
                    </p-avatar>
                    <div>
                        <h3 class="text-xl font-bold">{{ user?.name }}</h3>
                        <p class="text-sm text-gray-500">{{ user?.company }}</p>
                        <p-tag 
                            [value]="user?.status || 'Unknown'" 
                            [severity]="getStatusSeverity(user?.status)"
                            class="mt-1">
                        </p-tag>
                    </div>
                </div>

                <p-divider class="col-span-12"></p-divider>

                <!-- Detailed Information -->
                <div class="col-span-12 md:col-span-6">
                    <h4 class="font-medium mb-2">Contact Information</h4>
                    <div class="space-y-2">
                        <p class="text-sm"><span class="font-medium">Country:</span> {{ user?.country?.name }}</p>
                        <p class="text-sm"><span class="font-medium">Member Since:</span> {{ user?.date }}</p>
                    </div>
                </div>

                <div class="col-span-12 md:col-span-6">
                    <h4 class="font-medium mb-2">Activity</h4>
                    <div class="space-y-2">
                        <p class="text-sm"><span class="font-medium">Status:</span> {{ user?.status }}</p>
                        <p class="text-sm"><span class="font-medium">Activity Level:</span> {{ user?.activity || 0 }}/100</p>
                    </div>
                </div>

                <p-divider class="col-span-12"></p-divider>

                <!-- Additional Info -->
                <!-- <div class="col-span-12">
                    <h4 class="font-medium mb-2">Representative</h4>
                    <div class="flex items-center gap-2" *ngIf="user?.representative">
                        <p-avatar 
                            [image]="user?.representative?.image" 
                            size="normal"
                            shape="circle">
                        </p-avatar>
                        <span>{{ user?.representative?.name }}</span>
                    </div>
                    <p *ngIf="!user?.representative" class="text-sm text-gray-500">No representative assigned</p>
                </div> -->
            </div>

            <ng-template pTemplate="footer">
                <p-button pRipple type="button" label="Close" class="p-button-outlined" (click)="onClose()"></p-button>
                <p-button pRipple type="button" label="Contact User" class="p-button-primary" (click)="onContact()"></p-button>
            </ng-template>
        </p-dialog>
    `,
    styles: [`
        :host ::ng-deep {
            .p-dialog .p-dialog-header {
                border-bottom: 1px solid #e5e7eb;
            }
            .p-dialog .p-dialog-footer {
                border-top: 1px solid #e5e7eb;
                padding: 1rem;
            }
        }
    `]
})
export class UserInfoDialog {
    @Input() user: Customer | null = null;
    @Output() onCloseEvent = new EventEmitter<void>();
    @Output() onContactEvent = new EventEmitter<Customer>();

    visible: boolean = false;

    getStableColor(userId?: number): string {
        if (!userId) return '#6366F1'; // default color

        const colors = [
            '#6366F1', // indigo-500
            '#EC4899', // pink-500
            '#14B8A6', // teal-500
            '#F59E0B', // amber-500
            '#10B981', // emerald-500
            '#3B82F6', // blue-500
            '#8B5CF6'  // violet-500
        ];

        return colors[userId % colors.length];
    }

    getInitials(name: string = ''): string {
        if (!name) return '';
        return name.split(' ')
            .map(part => part.charAt(0))
            .join('')
            .toUpperCase();
    }

    show(user: Customer) {
        this.user = user;
        console.log("test", this.user);

        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    onHide() {
        this.onCloseEvent.emit();
    }

    onClose() {
        this.onCloseEvent.emit();
        this.hide();
    }

    onContact() {
        if (this.user) {
            this.onContactEvent.emit(this.user);
        }
        this.hide();
    }

    getStatusSeverity(status: string = ''): string {
        switch (status?.toLowerCase()) {
            case 'active': return 'success';
            case 'inactive': return 'danger';
            case 'pending': return 'warning';
            case 'new': return 'info';
            default: return 'info';
        }
    }

    getRandomColor(): string {
        const colors = [
            '#6366F1', // indigo-500
            '#EC4899', // pink-500
            '#14B8A6', // teal-500
            '#F59E0B', // amber-500
            '#10B981', // emerald-500
            '#3B82F6', // blue-500
            '#8B5CF6'  // violet-500
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}