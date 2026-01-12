import { Routes } from '@angular/router';
import { Empty } from './components/empty/empty';
import { Faq } from './components/faq/faq';
import { ContactUs } from './components/contactus/contactus';
import { TermsAndConditions } from './components/terms-and-conditions/terms-and-conditions';

export default [
    { path: 'empty', component: Empty, data: { breadcrumb: 'Empty' } },
    { path: 'faq', component: Faq, data: { breadcrumb: 'FAQ' } },
    { path: 'contact', component: ContactUs },
    { path: 'terms-and-conditions', component: TermsAndConditions, data: { breadcrumb: 'Terms and Conditions' } },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
