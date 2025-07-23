import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'transaction-action-dialog',
    standalone: true,
    imports: [DialogModule, FormsModule, ButtonModule],
    template: `
        <p-dialog [(visible)]="visible" [modal]="true" header="Add Transaction" [style]="{width: '400px'}" (onHide)="onClose()">
            <form (ngSubmit)="submit()" #form="ngForm">
                <div class="mb-3">
                    <label class="block mb-1">Type</label>
                    <select class="w-full p-2 border rounded" [(ngModel)]="type" name="type" required>
                        <option value="CREDIT">Deposit</option>
                        <option value="WITHDRAWAL">Withdrawal</option>
                        <option value="REFUND">Refund</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="block mb-1">Amount</label>
                    <input type="number" class="w-full p-2 border rounded" [(ngModel)]="amount" name="amount" required min="0.01" step="0.01" />
                </div>
                <div class="mb-3">
                    <label class="block mb-1">Description</label>
                    <input type="text" class="w-full p-2 border rounded" [(ngModel)]="description" name="description" />
                </div>
                <div class="flex justify-end gap-2 mt-4">
                    <button pButton type="button" label="Cancel" severity="secondary" (click)="onClose()"></button>
                    <button pButton type="submit" label="Submit" [disabled]="form.invalid"></button>
                </div>
            </form>
        </p-dialog>
    `
})
export class TransactionActionDialogComponent {
    @Input() visible = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() submitTransaction = new EventEmitter<{ type: string, amount: number, description: string }>();

    type: string = 'CREDIT';
    amount: number = 0;
    description: string = '';

    onClose() {
        this.visible = false;
        this.visibleChange.emit(this.visible);
    }

    submit() {
        if (this.amount > 0 && this.type) {
            this.submitTransaction.emit({
                type: this.type,
                amount: this.amount,
                description: this.description
            });
            this.onClose();
        }
    }
}