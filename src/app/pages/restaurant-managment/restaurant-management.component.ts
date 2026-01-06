import { Component, signal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RestaurantService, Restaurant } from '@/service/restaurant.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { AddressService } from '@/service/address.service';


@Component({
    selector: 'app-restaurant-management',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        InputTextModule,
        DialogModule,
        TagModule,
        ConfirmDialogModule,
        TableModule,
        DropdownModule,
        RadioButtonModule,
        ProgressSpinnerModule,
        ToggleSwitchModule
    ],
    templateUrl: './restaurant-management.component.html',
    styleUrls: ['./restaurant-management.scss'],
    providers: [MessageService, ConfirmationService, RestaurantService]
})
export class RestaurantManagementComponent {
    restaurants = signal<Restaurant[]>([]);
    restaurantDialog: boolean = false;
    restaurant: Restaurant = {} as Restaurant;
    selectedRestaurants: Restaurant[] = [];
    submitted: boolean = false;
    loading = signal<boolean>(true);
    constructor(
        private restaurantService: RestaurantService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private addressService: AddressService
    ) { }

    ngOnInit() {
        this.loadRestaurants();
    }

    loadRestaurants() {
        this.loading.set(true); // Set loading to true when starting request
        this.restaurantService.getRestaurants().subscribe({
            next: (data) => {
                this.restaurants.set(data);
                this.loading.set(false); // Set loading to false when data arrives
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.message || 'Failed to load restaurants',
                    life: 3000
                });
                this.loading.set(false); // Set loading to false on error too
            }
        });
    }


    openNew() {
        this.restaurant = {} as Restaurant;
        this.submitted = false;
        // Pre-populate address
        const savedAddress = this.addressService.getAddress();
        if (savedAddress) {
            this.restaurant.address = savedAddress.address || savedAddress.street || '';
        }
        this.restaurantDialog = true;
    }

    editRestaurant(restaurant: Restaurant) {
        this.restaurant = { ...restaurant };
        this.restaurantDialog = true;
    }

    deleteRestaurant(restaurant: Restaurant) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete ${restaurant.name}?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.restaurantService.deleteRestaurant(restaurant.id).subscribe({
                    next: () => {
                        this.restaurants.set(this.restaurants().filter(r => r.id !== restaurant.id));
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Restaurant Deleted',
                            life: 3000
                        });
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to delete restaurant',
                            life: 3000
                        });
                    }
                });
            }
        });
    }

    hideDialog() {
        this.restaurantDialog = false;
        this.submitted = false;
    }

    saveRestaurant() {
        this.submitted = true;

        if (this.restaurant.name?.trim()) {
            if (this.restaurant.id) {
                // Update existing restaurant
                this.restaurantService.updateRestaurant(this.restaurant.id, this.restaurant).subscribe({
                    next: (updatedRestaurant) => {
                        const index = this.restaurants().findIndex(r => r.id === updatedRestaurant.id);
                        if (index !== -1) {
                            const updatedRestaurants = [...this.restaurants()];
                            updatedRestaurants[index] = updatedRestaurant;
                            this.restaurants.set(updatedRestaurants);
                        }
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Restaurant Updated',
                            life: 3000
                        });
                        this.restaurantDialog = false;
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to update restaurant',
                            life: 3000
                        });
                    }
                });
            } else {
                // Create new restaurant
                this.restaurantService.createRestaurant(this.restaurant).subscribe({
                    next: (newRestaurant) => {
                        this.restaurants.set([...this.restaurants(), newRestaurant]);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Restaurant Created',
                            life: 3000
                        });
                        this.restaurantDialog = false;
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to create restaurant',
                            life: 3000
                        });
                    }
                });
            }
        }
    }

    confirmDeleteSelected() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected restaurants?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const deleteRequests = this.selectedRestaurants.map(restaurant =>
                    this.restaurantService.deleteRestaurant(restaurant.id)
                );

                // You might want to use forkJoin here if you want to wait for all deletions to complete
                deleteRequests.forEach(request => {
                    request.subscribe({
                        next: () => {
                            this.restaurants.set(this.restaurants().filter(r =>
                                !this.selectedRestaurants.some(s => s.id === r.id)
                            ));
                            this.selectedRestaurants = [];
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'Restaurants Deleted',
                                life: 3000
                            });
                        },
                        error: () => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Failed to delete one or more restaurants',
                                life: 3000
                            });
                        }
                    });
                });
            }
        });
    }

    getStatusSeverity(status: boolean) {
        return status ? 'success' : 'danger';
    }
}