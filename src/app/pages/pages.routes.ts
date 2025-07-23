import { Routes } from '@angular/router';
import { Empty } from './UI-component/empty/empty';
import { Faq } from './UI-component/faq/faq';
import { ContactUs } from './UI-component/contactus/contactus';

export default [
    { path: 'empty', component: Empty, data: { breadcrumb: 'Empty' } },
    { path: 'faq', component: Faq, data: { breadcrumb: 'FAQ' } },
    { path: 'contact', component: ContactUs },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
