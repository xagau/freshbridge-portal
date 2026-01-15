import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { RippleModule } from 'primeng/ripple';
import { TabsModule } from 'primeng/tabs';
import { Router } from '@angular/router';
import { ProductService, Product } from '@/service/product.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { environment } from '../../../../environments/environment';
import { FarmerService, Farmer } from '@/service/farmer.service';
import { AuthService } from '@/auth/auth.service';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputNumberModule,
        ButtonModule,
        RippleModule,
        TabsModule,
        ProgressSpinnerModule,
        ToastModule,
    ],
    providers: [MessageService, ProductService, FarmerService],
    templateUrl: "./productlist.component.html",
})
export class ProductList {
    products = signal<Product[]>([]);
    filteredProducts = signal<Product[]>([]);
    farms = signal<Farmer[]>([]);
    loading = signal<boolean>(true);
    showFarmFilter = signal<boolean>(false);
    selectedFarmId = signal<number | null>(null);

    // User role signals
    isAdmin = signal<boolean>(false);
    isFarmer = signal<boolean>(false);
    isRestaurant = signal<boolean>(false);

    // Current farmer ID (if user is a farmer)
    // currentFarmerId = signal<number | null>(null);
    currentUserId = signal<number | null>(null);
    public environment = environment;

    constructor(
        private router: Router,
        private productService: ProductService,
        private farmService: FarmerService,
        private messageService: MessageService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        // Set user role flags
        const userRole = this.authService.currentUserValue?.role;
        console.log("userRole:", userRole);
        
        this.isAdmin.set(userRole === 'ADMIN');
        this.isFarmer.set(userRole === 'FARMER');
        this.isRestaurant.set(userRole === 'RESTAURANT');

        // Get the current farmer ID if the user is a farmer
        if (this.isFarmer()) {
            const userId = this.authService.getProfileId();
            console.log('Current farmer ID:', userId);
            this.currentUserId.set(userId);
        }

        // Load products based on user role
        this.loadProducts();

        // Only load farms list if user is admin (for filtering)
        if (this.isAdmin()) {
            this.loadFarms();
        }
    }

    loadProducts() {
        this.loading.set(true);

        // Use the appropriate method based on user role
        // For farmers: getProducts() will filter by farmer ID
        // For restaurants and admins: getProductsAll() will show all products
        const productsObservable = this.isFarmer()
            ? this.productService.getProducts()
            : this.productService.getProductsAll();

        productsObservable.subscribe({
            next: (data) => {
                this.products.set(data);
                console.log("Products loaded:", data.length);

                // If user is a farmer, we can verify the products belong to them
                if (this.isFarmer() && this.currentUserId()) {
                    const userId = this.currentUserId();
                    console.log(`Verifying products belong to farmer ID: ${userId}`);

                    // This is just a verification step - the API should already filter correctly
                    const farmerProducts = data.filter(product => product.farmerId === userId);
                    if (farmerProducts.length !== data.length) {
                        console.warn(`Found ${data.length} products, but only ${farmerProducts.length} belong to the current farmer`);
                    }
                }

                this.filteredProducts.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error("Error loading products:", err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load products',
                    life: 3000
                });
                this.loading.set(false);
            }
        });
    }

    loadFarms() {
        this.farmService.getFarmers().subscribe({
            next: (data) => {
                this.farms.set(data);
                console.log(data);

            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load farms',
                    life: 3000
                });
            }
        });
    }

    toggleFarmFilter() {
        this.showFarmFilter.update(prev => !prev);
    }

    filterByFarm(farmId: number | null) {
        console.log(farmId);

        this.selectedFarmId.set(farmId);
        if (farmId) {
            this.filteredProducts.set(
                this.products().filter(product => product.farmerId === farmId)
            );
        } else {
            this.filteredProducts.set(this.products());
        }
    }

    clearFarmFilter() {
        this.selectedFarmId.set(null);
        this.filteredProducts.set(this.products());
    }

    viewFarmProducts(event: Event, farmId: number) {
        event.stopPropagation(); // Prevent the product click event from firing
        this.selectedFarmId.set(farmId);
        this.filterByFarm(farmId);
    }

    goToProduct(product: Product) {
        this.router.navigate(['product-management/overview', product.id]);
    }

    createNewProject() {
        this.router.navigate(['product-management/create']);
    }

    setDefaultImage(event: Event) {
        const img = event.target as HTMLImageElement;
        img.src = 'images/product/simple2.png';
        img.classList.add('default-image');
    }

    setDefaultFarmImage(event: Event) {
        const img = event.target as HTMLImageElement;
        img.src = 'https://via.placeholder.com/150'; // Default farm logo
        img.classList.add('default-image');
    }
}