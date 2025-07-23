import { ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { CreditScoreWidget } from '@/pages/payment-invoice/components/creditscorewidget';
import { TransactionsHistoryWidget } from '@/pages/payment-invoice/components/transactionshistorywidget';

@Component({
    selector: 'app-banking-dashboard',
    standalone: true,
    imports: [
        // CurrencyCardWidget,
        CreditScoreWidget,
        TransactionsHistoryWidget],
    template: `<section>
        <div class="flex flex-col gap-7">
            <!-- <currency-card-widget /> -->
            <div class="flex xl:flex-row flex-col gap-6">
                <credit-score-widget (transactionSubmitted)="onTransactionSubmitted()"/>
                <transactions-history-widget />
            </div>
        </div>
    </section>`
})
export class BankingDashboard {
    @ViewChild(TransactionsHistoryWidget) transactionsHistoryWidget!: TransactionsHistoryWidget;

    onTransactionSubmitted() {
        this.transactionsHistoryWidget.reloadTransactions();
    }
}
