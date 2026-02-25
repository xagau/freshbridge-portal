import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { RippleModule } from 'primeng/ripple';
import { TabsModule } from 'primeng/tabs';
import { MultiSelectModule } from 'primeng/multiselect';
import { Router } from '@angular/router';
import { ProductService, Product } from '@/service/product.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { environment } from '../../../../environments/environment';
import { MerchantService, Merchant } from '@/service/merchant.service';
import { AuthService } from '@/auth/auth.service';
import { OrdersService } from '@/service/orders.service';
import { Order } from '@/model/order.model';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';

type MerchantOption = Merchant & { name: string };

interface OrderItemState {
    orderId: number;
    itemId: number;
    quantity: number;
    productId: number;
}

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
        MultiSelectModule,
        ProgressSpinnerModule,
        ToastModule,
        DialogModule,
        DropdownModule,
    ],
    providers: [MessageService, ProductService, MerchantService],
    templateUrl: "./productlist.component.html",
})
export class ProductList {
    products = signal<Product[]>([]);
    filteredProducts = signal<Product[]>([]);
    merchants = signal<MerchantOption[]>([]);
    loading = signal<boolean>(true);
    selectedMerchantId = signal<number | null>(null);
    /** Bound to multiSelect; selected merchants shown as chips. */
    selectedMerchantList: MerchantOption[] = [];

    // User role signals
    isAdmin = signal<boolean>(false);
    isMerchant = signal<boolean>(false);
    isBuyer = signal<boolean>(false);

    // Current merchant ID (if user is a merchant)
    // currentMerchantId = signal<number | null>(null);
    currentUserId = signal<number | null>(null);
    public environment = environment;

    // Quick-add state
    activeOrders: Order[] = [];
    orderItemMap = new Map<number, OrderItemState>();
    cardLoadingMap = new Map<number, boolean>();
    pendingUpdates = new Map<number, ReturnType<typeof setTimeout>>();

    // Multi-order dialog state
    showOrderSelectDialog = false;
    addingProduct: Product | null = null;
    selectedOrderForAdd: Order | null = null;

    constructor(
        private router: Router,
        private productService: ProductService,
        private merchantService: MerchantService,
        private messageService: MessageService,
        private authService: AuthService,
        private ordersService: OrdersService
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
        if (this.isAdmin() || this.isBuyer()) {
            this.loadMerchants();
        }

        // Load active orders for quick-add (buyer only)
        if (this.isBuyer()) {
            this.loadActiveOrders();
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
                const list = Array.isArray(data) ? data : [];
                this.products.set(list);
                // If user is a merchant, we can verify the products belong to them
                if (this.isMerchant() && this.currentUserId()) {
                    const userId = this.currentUserId();

                    // This is just a verification step - the API should already filter correctly
                    const merchantProducts = list.filter(product => product.merchantId === userId);
                    if (merchantProducts.length !== list.length) {
                        console.warn(`Found ${list.length} products, but only ${merchantProducts.length} belong to the current merchant`);
                    }
                }

                console.log("data", list);
                this.filteredProducts.set(list);
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
                const list = Array.isArray(data) ? data : [];
                this.merchants.set(list.map((m: Merchant) => ({ ...m, name: `${m.firstName} ${m.lastName}`.trim() || `Merchant ${m.id}` })));
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

    loadActiveOrders() {
        const userId = this.authService.getProfileId();
        if (!userId) return;

        this.ordersService.listByRole({ userId }).subscribe({
            next: (orders) => {
                this.activeOrders = (orders || []).filter(o =>
                    o.status !== 'CANCELLED' && o.status !== 'cancelled'
                );
                this.buildOrderItemMap();
            },
            error: (err) => {
                console.error('Failed to load active orders for quick-add:', err);
            }
        });
    }

    buildOrderItemMap() {
        this.orderItemMap.clear();
        for (const order of this.activeOrders) {
            if (!order.items) continue;
            for (const item of order.items) {
                if (item.productId != null) {
                    this.orderItemMap.set(item.productId, {
                        orderId: order.id,
                        itemId: item.id,
                        quantity: item.quantity,
                        productId: item.productId,
                    });
                }
            }
        }
    }

    getOrderState(productId: number): OrderItemState | null {
        return this.orderItemMap.get(productId) ?? null;
    }

    onQuickAdd(event: Event, product: Product) {
        event.stopPropagation();

        if (this.activeOrders.length === 0) {
            this.messageService.add({
                severity: 'info',
                summary: 'No Repeating Orders',
                detail: 'Create a repeating order first at Schedule Order, then add products.',
                life: 4000
            });
            return;
        }

        if (this.activeOrders.length === 1) {
            this.doAdd(product, this.activeOrders[0].id);
            return;
        }

        // Multiple orders — show dialog
        this.addingProduct = product;
        this.selectedOrderForAdd = this.activeOrders[0];
        this.showOrderSelectDialog = true;
    }

    doAdd(product: Product, orderId: number) {
        this.setCardLoading(product.id, true);
        this.ordersService.addItemToOrder(orderId, { productId: product.id, quantity: 1 }).subscribe({
            next: () => {
                this.setCardLoading(product.id, false);
                this.loadActiveOrders();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Added',
                    detail: `${product.name} added to your order.`,
                    life: 2500
                });
            },
            error: (err) => {
                console.error('Failed to add item:', err);
                this.setCardLoading(product.id, false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to add item to order.',
                    life: 3000
                });
            }
        });
    }

    onQtyChange(event: Event, product: Product, delta: number) {
        event.stopPropagation();

        const state = this.getOrderState(product.id);
        if (!state) return;

        const newQty = state.quantity + delta;

        // Optimistic update
        const updated: OrderItemState = { ...state, quantity: newQty };
        this.orderItemMap.set(product.id, updated);

        // Cancel any pending debounce for this product
        const existing = this.pendingUpdates.get(product.id);
        if (existing) clearTimeout(existing);

        // Schedule flush
        const timer = setTimeout(() => {
            this.flushQtyUpdate(product, state, newQty);
            this.pendingUpdates.delete(product.id);
        }, 400);

        this.pendingUpdates.set(product.id, timer);
    }

    flushQtyUpdate(product: Product, originalState: OrderItemState, newQty: number) {
        this.setCardLoading(product.id, true);

        if (newQty <= 0) {
            this.ordersService.removeOrderItem(originalState.orderId, originalState.itemId).subscribe({
                next: () => {
                    this.setCardLoading(product.id, false);
                    this.loadActiveOrders();
                },
                error: (err) => {
                    console.error('Failed to remove item:', err);
                    // Revert optimistic update
                    this.orderItemMap.set(product.id, originalState);
                    this.setCardLoading(product.id, false);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to remove item from order.',
                        life: 3000
                    });
                }
            });
        } else {
            this.ordersService.updateOrderItem(originalState.orderId, originalState.itemId, product.id, newQty).subscribe({
                next: () => {
                    this.setCardLoading(product.id, false);
                    this.loadActiveOrders();
                },
                error: (err) => {
                    console.error('Failed to update item:', err);
                    // Revert optimistic update
                    this.orderItemMap.set(product.id, originalState);
                    this.setCardLoading(product.id, false);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to update quantity.',
                        life: 3000
                    });
                }
            });
        }
    }

    onConfirmOrderSelect() {
        if (this.addingProduct && this.selectedOrderForAdd) {
            this.doAdd(this.addingProduct, this.selectedOrderForAdd.id);
        }
        this.showOrderSelectDialog = false;
        this.addingProduct = null;
        this.selectedOrderForAdd = null;
    }

    setCardLoading(productId: number, loading: boolean) {
        this.cardLoadingMap.set(productId, loading);
    }

    onMerchantSelectionChange(): void {
        this.filterByMerchants();
    }

    filterByMerchants(): void {
        const list = this.products() ?? [];
        if (this.selectedMerchantList.length > 0) {
            const ids = this.selectedMerchantList.map(m => m.id);
            this.filteredProducts.set(list.filter(product => ids.includes(product.merchantId)));
        } else {
            this.filteredProducts.set(list);
        }
    }

    clearMerchantFilter(): void {
        this.selectedMerchantList = [];
        this.selectedMerchantId.set(null);
        this.filteredProducts.set(this.products() ?? []);
    }

    viewMerchantProducts(event: Event, merchantId: number): void {
        event.stopPropagation();
        const option = this.merchants().find(m => m.id === merchantId);
        if (option && !this.selectedMerchantList.some(m => m.id === merchantId)) {
            this.selectedMerchantList = [...this.selectedMerchantList, option];
            this.filterByMerchants();
        }
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
