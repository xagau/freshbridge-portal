import { Routes } from '@angular/router';
import { UserList } from './user-list/userlist';
import { UserCreate } from './usercreate';

export default [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'list', data: { breadcrumb: 'User List' }, component: UserList },
    { path: 'create', data: { breadcrumb: 'Create User' }, component: UserCreate }
] as Routes;
