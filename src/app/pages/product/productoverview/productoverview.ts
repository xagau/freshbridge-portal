import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { RippleModule } from 'primeng/ripple';
import { TabsModule } from 'primeng/tabs';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { Router, ActivatedRoute } from '@angular/router';
import { OrdersService } from '@/service/orders.service';
import { MessageService } from 'primeng/api';
import { ProductService, Product } from '@/service/product.service';
import { environment } from '../../../../environments/environment';
import { Order } from '@/model/order.model'; // Make sure this import exists
import { ToastModule } from 'primeng/toast';
import { AuthService } from '@/auth/auth.service';

@Component({
    selector: 'app-product-overview',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputNumberModule,
        ButtonModule,
        RippleModule,
        TabsModule,
        DialogModule,
        MultiSelectModule,
        DropdownModule,
        CalendarModule,
        ToastModule
    ],
    providers: [OrdersService, MessageService, ProductService, AuthService],
    templateUrl: './productoverview.component.html',
})
export class ProductOverview implements OnInit {
    @Output() itemAdded = new EventEmitter<any>();
    public environment = environment;

    color: string = 'bluegray';
    size: string = 'M';
    liked: boolean = false;
    images: string[] = [];
    selectedImageIndex: number = 0;
    quantity: number = 1;
    showOrderDialog: boolean = false;
    constructor(
        private router: Router,
        private messageService: MessageService,
        private orderService: OrdersService,
        private route: ActivatedRoute,
        private productService: ProductService,
        private authService: AuthService,
    ) { }


    existingOrders: { id: string, name: string }[] = [];

    selectedOrder: any = null;

    newOrder = {
        name: '',
        frequency: { label: 'One-time', value: 'once' },
        deliveryDays: [],
        deliveryTime: null,
        deliveryDate: null,
        startDate: new Date(),
        endDate: null,
        items: []
    };
    product: Product = {
        id: 0,
        farmerId: 0,
        farmer: { id: 0, firstName: '', lastName: '', email: '', phoneNumber: '' },
        name: "",
        description: "",
        price: 0,
        unit: "",
        quantityAvailable: 0,
        imageUrls: [],
        harvestDateStr: '',
        harvestDate: '',
    }
    ngOnInit(): void {

        this.route.params.subscribe(params => {
            const productId = params['id'];
            console.log('Product ID from URL:', productId);

            // You can now use this productId to fetch product details
            this.product.id = productId;

            // If you need to fetch product details from a service:
            this.productService.getProduct(productId).subscribe({
                next: (product) => {
                    this.product = product;
                    console.log("product", this.product);

                    this.images = this.product.imageUrls
                },
                error: (err) => {
                    console.error('Failed to fetch product details:', err);
                    // Handle error, maybe show a message to the user
                }
            });
        });

        // Fetch real orders for the restaurant (or user)

        this.farmerUserId = this.authService.getProfileId() || 1;

        this.orderService.listByRole({ userId: this.farmerUserId }).subscribe({
            next: (orders: Order[]) => {
                // Map orders to dropdown format with summary
                console.log(orders);

                this.existingOrders = orders.map(order => {
                    // Parse repeatOnDays string to array, e.g. "TUESDAY,WEDNESDAY" => ["TUESDAY", "WEDNESDAY"]
                    const repeatDays = (order.repeatOnDays || '')
                        .split(',')
                        .map(day => day.trim().toLowerCase())
                        .filter(day => !!day);

                    // Define all week days
                    const allWeekDays = [
                        { label: 'Monday', value: 'monday' },
                        { label: 'Tuesday', value: 'tuesday' },
                        { label: 'Wednesday', value: 'wednesday' },
                        { label: 'Thursday', value: 'thursday' },
                        { label: 'Friday', value: 'friday' },
                        { label: 'Saturday', value: 'saturday' },
                        { label: 'Sunday', value: 'sunday' }
                    ];

                    // Mark selected days
                    const weekDays = allWeekDays.map(day => ({
                        ...day,
                        selected: repeatDays.includes(day.value)
                    }));

                    return {
                        id: order.id.toString(),
                        name: this.orderService.getScheduleSummary({
                            selectedFrequency: { value: order.frequency?.toLowerCase() ?? '', label: order.frequency },
                            weekDays: weekDays,
                            startDate: new Date(order.startDate),
                            endCondition: order.openEnd ? 'never' : (order.endDate ? 'date' : ''),
                            endDate: order.endDate ? new Date(order.endDate) : null,
                            deliveryAddress: order.deliveryAddress
                        })
                    };
                });
            },
            error: (err) => {
                console.error('Failed to fetch existing orders:', err);
            }
        });
    }

    createNewOrder() {
        this.showOrderDialog = false;
        this.router.navigate(['/schedule-order']);
    }
    restaurantId = 1;
    farmerUserId = 1;
    addToOrder() {
        const orderItem = {
            productId: this.product.id,
            quantity: this.quantity
        };

        if (this.selectedOrder) {
            // Add to existing order
            this.orderService.addItemToOrder(Number(this.selectedOrder.id), orderItem).subscribe({
                next: (result) => {
                    this.itemAdded.emit({
                        orderId: this.selectedOrder.id,
                        item: orderItem
                    });
                    this.showOrderDialog = false;
                    this.resetOrderForm();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Item added to existing order successfully'
                    });
                },
                error: (err) => {
                    console.error('Failed to add item to order:', err);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to add item to existing order'
                    });
                }
            });
            return;
        }
    }

    resetOrderForm() {
        this.selectedOrder = null;
        this.newOrder = {
            name: '',
            frequency: { label: 'One-time', value: 'once' },
            deliveryDays: [],
            deliveryTime: null,
            deliveryDate: null,
            startDate: new Date(),
            endDate: null,
            items: []
        };
    }

    goToProductlist() {
        this.router.navigate(['product-management']);
    }


    setDefaultImage(event: Event) {
        const img = event.target as HTMLImageElement;
        // Set your default image path here
        img.src = 'https://www.dobies.co.uk/product_images/CUCU-mh-14400-A.jpg';

        // Optional: Add a CSS class to style broken images differently
        img.classList.add('default-image');
    }
}