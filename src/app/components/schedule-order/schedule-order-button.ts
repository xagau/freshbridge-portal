import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ScheduleRepeatOrderDialog } from './schedule-repeat-order-dialog.component';

@Component({
    selector: 'app-schedule-order-button',
    standalone: true,
    imports: [CommonModule, ButtonModule, ScheduleRepeatOrderDialog],
    template: `
        <p-button 
            icon="pi pi-calendar-plus" 
            label="Schedule Recurring Order" 
            (click)="showDialog()">
        </p-button>

        <app-schedule-repeat-order-dialog 
            #scheduleDialog
            (onSaveEvent)="onScheduleSave($event)"
            (onCancelEvent)="onScheduleCancel()">
        </app-schedule-repeat-order-dialog>
    `
})
export class ScheduleOrderButton {
    @Output() scheduleSave = new EventEmitter<any>();
    @Output() scheduleCancel = new EventEmitter<void>();

    @ViewChild('scheduleDialog') scheduleDialog!: ScheduleRepeatOrderDialog;

    showDialog() {
        // You can access the dialog via ViewChild if you need to pass initial data
        this.scheduleDialog.show();
    }

    onScheduleSave(event: any) {
        this.scheduleSave.emit(event);
    }

    onScheduleCancel() {
        this.scheduleCancel.emit();
    }
}