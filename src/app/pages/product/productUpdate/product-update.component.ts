import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MessageService } from 'primeng/api';
import { ProductService, Product } from '@/service/product.service';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '@/auth/auth.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { environment } from '../../../../environments/environment';


@Component({
    selector: 'app-product-update',
    standalone: true,
    imports: [
        CommonModule,
        EditorModule,
        InputTextModule,
        FormsModule,
        FileUploadModule,
        ButtonModule,
        SelectModule,
        ToggleButtonModule,
        RippleModule,
        ChipModule,
        TextareaModule,
        ToastModule,
        ProgressSpinnerModule
    ],
    providers: [MessageService, ProductService, AuthService],
    templateUrl: './product-update.component.html',
})
export class ProductUpdateComponent implements OnInit {
    product: Partial<Product> = {
        name: '',
        description: '',
        price: 0,
        unit: 'Kilogram (kg)',
        quantityAvailable: 0,
        imageUrls: [],  // Now an array
        harvestDate: new Date().toISOString().split('T')[0]
    };
    unitOptions = ['Each',
        'Pound (lb)',
        'Kilogram (kg)',
        'Carton',
        'Case',
        'Tray',
        'Box',
        'Lug',
        'Pallet'];
    loading = false;
    selectedFiles: File[] = [];
    previewUrls: (string | ArrayBuffer)[] = [];
    maxImages = 4;
    imageUrls: string[] = [];

    // Store the current merchant ID
    // currentMerchantId: number | null = null;
    userId: number | null = null;
    constructor(
        private productService: ProductService,
        private messageService: MessageService,
        private router: Router,
        private authService: AuthService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        // Get the current user's role
        const userRole = this.authService.currentUserValue?.role;
        this.loading = true;
        // If the user is a merchant, get their merchant ID
        if (userRole === 'MERCHANT') {
            this.userId = this.authService.getProfileId();
            console.log('Current merchant ID:', this.userId);
        } else if (userRole === 'ADMIN') {
            // Admins can create products for any merchant, but we'll need to handle this differently
            // For now, we'll just log a message
            console.log('Admin user detected. Will need to select a merchant.');
        } else {
            // If the user is not a merchant or admin, they shouldn't be on this page
            this.messageService.add({
                severity: 'error',
                summary: 'Access Denied',
                detail: 'You do not have permission to create products'
            });
            this.router.navigate(['/product-management']);
        }

        this.route.params.subscribe(params => {
            const productId = params['id'];
            console.log('Product ID from URL:', productId);

            // You can now use this productId to fetch product details
            this.product.id = productId;

            // If you need to fetch product details from a service:
            this.productService.getProduct(productId).subscribe({
                next: (product) => {
                    this.product = product;
                    this.product.harvestDate = new Date(this.product.harvestDate??'').toISOString().split('T')[0];
                    this.imageUrls = this.product.imageUrls || [];
                    this.convertImageUrlsToPreviewUrls(this.imageUrls);
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Failed to fetch product details:', err);
                    // Handle error, maybe show a message to the user
                    this.loading = false;
                }
            });
        });
    }

    /**
     * Converts network image URLs to File objects and data source URLs for preview
     * @param imageUrls Array of network image URLs
     */
    private convertImageUrlsToPreviewUrls(imageUrls: string[]) {
        this.previewUrls = []; // Clear existing previews
        this.selectedFiles = []; // Clear existing files
        
        imageUrls.forEach((url, index) => {
            // Check if the URL is already a full URL or just a path
            const fullUrl = url.startsWith('http') 
                ? url 
                : `${environment.apiUrl}merchant-products/${url}`;
            
            console.log("Fetching image from:", fullUrl);
            
            fetch(fullUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.blob();
                })
                .then(blob => {
                    // Extract filename from URL or create a default one
                    const urlParts = url.split('/');
                    const filename = urlParts[urlParts.length - 1] || `image-${index}.jpg`;
                    
                    // Convert blob to File object
                    const file = new File([blob], filename, { type: blob.type });
                    this.selectedFiles.push(file);
                    console.log("selectedFiles", this.selectedFiles);
                    
                    console.log("Added file to selectedFiles:", file.name);
                    
                    // Create preview URL
                    const reader = new FileReader();
                    reader.onload = () => {
                        this.previewUrls.push(reader.result as string);
                        console.log("previewUrls count:", this.previewUrls.length);
                    };
                    reader.readAsDataURL(file);
                })
                .catch(error => {
                    console.error('Failed to load image from URL:', fullUrl, error);
                    // Optionally add a placeholder or show an error message
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Warning',
                        detail: 'Failed to load one or more images'
                    });
                });
        });
    }

    onSubmit() {
        this.loading = true;

        // Check if we have a valid merchant ID
        if (!this.userId && this.authService.currentUserValue?.role === 'MERCHANT') {
            this.handleError('Unable to determine your merchant ID. Please try logging in again.');
            return;
        }

        // For admin users who might be creating products for any merchant
        // In a real app, you'd have a merchant selector in the UI
        const UID = this.userId ||
            (this.authService.currentUserValue?.role === 'ADMIN' ? 1 : null);

        if (!UID) {
            this.handleError('No merchant ID available. Cannot update product.');
            return;
        }

        const productToUpdate: Product = {
            ...this.product,
            price: Number(this.product.price),
            quantityAvailable: Number(this.product.quantityAvailable),
            userId: UID, // Use the merchant ID from auth service
            harvestDateStr: this.product.harvestDate || new Date().toISOString().split('T')[0]
        } as Product;

        // First update the product
        this.productService.updateProduct(this.product.id ?? 0, productToUpdate).subscribe({
            next: (updatedProduct) => {
                // If there's an image to upload, do it after product creation
                console.log(updatedProduct);
                
                if (this.selectedFiles) {
                    this.uploadImages(updatedProduct.id);
                } else {
                    this.onSuccess();
                }
            },
            error: (err) => {
                this.loading
                this.handleError('Failed to update product');
            }
        });
    }

    private uploadImages(productId: number) {
        this.productService.uploadProductImages(productId, this.selectedFiles).subscribe({
            next: (response) => {
                // Split the comma-separated string if needed
                this.product.imageUrls = response.imageUrls;
                this.onSuccess();
                
            },
            error: (err) => {
                this.handleError('Product updated but image upload failed');
                this.loading = false;
            }
        });
    }

    private onSuccess() {
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product updated successfully'
        });
        this.loading = false;
    }

    private handleError(message: string) {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message
        });
        this.loading = false;
    }

    onImageSelect(event: any) {
        const files: File[] = event.files;

        if (!files || files.length === 0) return;

        // Validate total number of images
        if (this.selectedFiles.length + files.length > this.maxImages) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: `You can upload maximum ${this.maxImages} images`
            });
            return;
        }

        // Validate each file
        for (const file of files) {
            if (!file.type.match('image.*')) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Only image files are allowed'
                });
                return;
            }

            if (file.size > 1000000) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'File size must be less than 2MB'
                });
                return;
            }

            this.selectedFiles.push(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = () => {
                this.previewUrls.push(reader.result as string);
                console.log(this.previewUrls);
                
            };
            reader.readAsDataURL(file);
        }
    }

    onClearImage(index: number) {
        this.selectedFiles.splice(index, 1);
        this.previewUrls.splice(index, 1);
    }

    onClearAllImages() {
        this.selectedFiles = [];
        this.previewUrls = [];
    }

    onCancel() {
        this.router.navigate(['/product-management']);
    }

    private resetForm() {
        this.product = {
            name: '',
            description: '',
            price: 0,
            unit: 'Kilogram (kg)',
            quantityAvailable: 0,
            imageUrls: [],
            harvestDate: new Date().toISOString().split('T')[0]
        };
        this.selectedFiles = [];
        this.onClearAllImages();
    }
}