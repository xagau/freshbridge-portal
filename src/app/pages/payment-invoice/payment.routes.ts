import { Routes } from '@angular/router';

export default [
    {
        path: 'transfer-history',
        data: { breadcrumb: 'Account' },
        loadComponent: () => import('./payment').then((c) => c.BankingDashboard)
    },
    // {
    //     path: 'transfer-ledger',
    //     data: { breadcrumb: 'Product List' },
    //     loadComponent: () => import('../dashboards/productlist').then((c) => c.ProductList)
    // },

] as Routes;
