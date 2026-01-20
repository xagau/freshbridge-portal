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
import { MerchantService, Merchant } from '@/service/merchant.service';
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
    providers: [MessageService, ProductService, MerchantService],
    templateUrl: "./productlist.component.html",
})
export class ProductList {
    products = signal<Product[]>([]);
    filteredProducts = signal<Product[]>([]);
    merchants = signal<Merchant[]>([]);
    loading = signal<boolean>(true);
    showMerchantFilter = signal<boolean>(false);
    selectedMerchantId = signal<number | null>(null);

    // User role signals
    isAdmin = signal<boolean>(false);
    isMerchant = signal<boolean>(false);
    isBuyer = signal<boolean>(false);

    // Current merchant ID (if user is a merchant)
    // currentMerchantId = signal<number | null>(null);
    currentUserId = signal<number | null>(null);
    public environment = environment;

    constructor(
        private router: Router,
        private productService: ProductService,
        private merchantService: MerchantService,
        private messageService: MessageService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        // Set user role flags
        const userRole = this.authService.currentUserValue?.role;
        console.log("userRole:", userRole);
        
        this.isAdmin.set(userRole === 'ADMIN');
        this.isMerchant.set(userRole === 'MERCHANT');
        this.isBuyer.set(userRole === 'BUYER');

        // Get the current merchant ID if the user is a merchant
        if (this.isMerchant()) {
            const userId = this.authService.getProfileId();
            console.log('Current merchant ID:', userId);
            this.currentUserId.set(userId);
        }

        // Load products based on user role
        this.loadProducts();

        // Only load merchants list if user is admin (for filtering)
        if (this.isAdmin()) {
            this.loadMerchants();
        }
    }

    loadProducts() {
        this.loading.set(true);

        // Use the appropriate method based on user role
        // For merchants: getProducts() will filter by merchant ID
        // For buyers and admins: getProductsAll() will show all products
        const productsObservable = this.isMerchant()
            ? this.productService.getProducts()
            : this.productService.getProductsAll();

        productsObservable.subscribe({
            next: (data) => {
                this.products.set(data);
                console.log("Products loaded:", data.length);

                // If user is a merchant, we can verify the products belong to them
                if (this.isMerchant() && this.currentUserId()) {
                    const userId = this.currentUserId();
                    console.log(`Verifying products belong to merchant ID: ${userId}`);

                    // This is just a verification step - the API should already filter correctly
                    const merchantProducts = data.filter(product => product.merchantId === userId);
                    if (merchantProducts.length !== data.length) {
                        console.warn(`Found ${data.length} products, but only ${merchantProducts.length} belong to the current merchant`);
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

    loadMerchants() {
        this.merchantService.getMerchants().subscribe({
            next: (data) => {
                this.merchants.set(data);
                console.log(data);

            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load merchants',
                    life: 3000
                });
            }
        });
    }

    toggleMerchantFilter() {
        this.showMerchantFilter.update(prev => !prev);
    }

    filterByMerchant(merchantId: number | null) {
        console.log(merchantId);

        this.selectedMerchantId.set(merchantId);
        if (merchantId) {
            this.filteredProducts.set(
                this.products().filter(product => product.merchantId === merchantId)
            );
        } else {
            this.filteredProducts.set(this.products());
        }
    }

    clearMerchantFilter() {
        this.selectedMerchantId.set(null);
        this.filteredProducts.set(this.products());
    }

    viewMerchantProducts(event: Event, merchantId: number) {
        event.stopPropagation(); // Prevent the product click event from firing
        this.selectedMerchantId.set(merchantId);
        this.filterByMerchant(merchantId);
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

    setDefaultMerchantImage(event: Event) {
        const img = event.target as HTMLImageElement;
        img.src = 'https://via.placeholder.com/150'; // Default merchant logo
        img.classList.add('default-image');
    }
}