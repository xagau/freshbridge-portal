import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CustomerService, Customer } from '@/service/customer.service';
import { RoleBadgePipe } from '@/shared/pipes/role-badge.pipe';
import { UserInfoDialog } from '@/components/userinfo-dialogue/user-info-dialogue.component';


interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-crud',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        RoleBadgePipe,
        UserInfoDialog
    ],
    templateUrl: './userlist.component.html',
    providers: [MessageService, CustomerService, ConfirmationService]
})
export class UserList implements OnInit {
    filterFields: string[] = ['name', 'country.name', 'company', 'status', 'role', 'balance'];

    userDialog: boolean = false;
    roleDialog: boolean = false;

    users = signal<any[]>([]);

    user: any = {};
    selectedUser: any = {};
    selectedRole: string = '';

    selectedUsers: any[] = [];

    submitted: boolean = false;

    statuses: string[] = ['unqualified', 'qualified', 'new', 'negotiation', 'renewal'];
    countries: any[] = [];
    roles: string[] = ['ADMIN', 'MERCHANT', 'BUYER', 'USER'];

    @ViewChild('dt') dt!: Table;
    @ViewChild(UserInfoDialog) userInfoDialog!: UserInfoDialog;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private customerService: CustomerService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadDemoData();
    }


    showUserInfo(userName: string) {
        const customer = this.customerService.getCustomerByName(userName);
        console.log("test", userName);
        
        if (customer) {
            this.userInfoDialog.show(customer);
        }
    }

    onUserDialogClose() {
        console.log('User dialog closed');
    }

    onContactUser(user: Customer) {
        console.log('Contact user:', user);
        // Implement your contact logic here
    }


    loadDemoData() {
        this.customerService.getCustomersLarge().then((data) => {
            // Add role to each user
            const usersWithRoles = data.map((user) => ({
                ...user,
                role: this.getRandomRole()
            }));
            this.users.set(usersWithRoles);
        });

        this.countries = [
            { name: 'Algeria', code: 'dz' },
            { name: 'Egypt', code: 'eg' },
            { name: 'United States', code: 'us' },
            { name: 'United Kingdom', code: 'gb' },
            { name: 'Germany', code: 'de' },
            { name: 'France', code: 'fr' }
        ];

        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'country.name', header: 'Country' },
            { field: 'company', header: 'Company' },
            { field: 'status', header: 'Status' },
            { field: 'role', header: 'Role' },
            { field: 'balance', header: 'Balance' }
        ];

        this.exportColumns = this.cols.map((col) => ({
            title: col.header,
            dataKey: col.field
        }));
    }

    getRandomRole(): string {
        const roles = ['ADMIN', 'MERCHANT', 'BUYER', 'USER'];
        return roles[Math.floor(Math.random() * roles.length)];
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.user = {};
        this.submitted = false;
        this.userDialog = true;
    }

    editUser(user: any) {
        this.user = { ...user };
        this.userDialog = true;
    }

    changeRole(user: any) {
        this.selectedUser = user;
        this.selectedRole = user.role;
        this.roleDialog = true;
    }

    updateRole() {
        this.selectedUser.role = this.selectedRole;
        this.users.set([...this.users()]);
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Role Updated',
            life: 3000
        });
        this.roleDialog = false;
    }

    deleteSelectedUsers() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected users?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.users.set(this.users().filter((val) => !this.selectedUsers.includes(val)));
                this.selectedUsers = [];
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Users Deleted',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.userDialog = false;
        this.submitted = false;
    }

    deleteUser(user: any) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + user.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.users.set(this.users().filter((val) => val.id !== user.id));
                this.user = {};
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'User Deleted',
                    life: 3000
                });
            }
        });
    }

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.users().length; i++) {
            if (this.users()[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    getStatusSeverity(status: string) {
        switch (status) {
            case 'unqualified':
                return 'danger';
            case 'qualified':
                return 'success';
            case 'new':
                return 'info';
            case 'negotiation':
                return 'warning';
            case 'renewal':
                return 'primary';
            default:
                return 'secondary';
        }
    }

    saveUser() {
        this.submitted = true;
        let _users = this.users();

        if (this.user.name?.trim()) {
            if (this.user.id) {
                _users[this.findIndexById(this.user.id)] = this.user;
                this.users.set([..._users]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'User Updated',
                    life: 3000
                });
            } else {
                this.user.id = this.createId();
                this.user.role = 'USER'; // Default role for new users
                this.user.representative = { name: 'Amy Elsner', image: 'amyelsner.png' };
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'User Created',
                    life: 3000
                });
                this.users.set([..._users, this.user]);
            }

            this.userDialog = false;
            this.user = {};
        }
    }

    createId(): number {
        return Math.floor(Math.random() * 10000) + 1000;
    }
}
