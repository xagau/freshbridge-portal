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
import { FarmerService, Farmer } from '@/service/farmer.service'; // You'll need to create this service

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

    public environment = environment;

    constructor(
        private router: Router,
        private productService: ProductService,
        private farmService: FarmerService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.loadProducts();
        this.loadFarms();
    }

    loadProducts() {
        this.loading.set(true);
        this.productService.getProducts().subscribe({
            next: (data) => {
                this.products.set(data);
                console.log("data", data);

                this.filteredProducts.set(data);
                this.loading.set(false);
            },
            error: (err) => {
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
        img.src = 'https://www.dobies.co.uk/product_images/CUCU-mh-14400-A.jpg';
        img.classList.add('default-image');
    }

    setDefaultFarmImage(event: Event) {
        const img = event.target as HTMLImageElement;
        img.src = 'https://via.placeholder.com/150'; // Default farm logo
        img.classList.add('default-image');
    }
}