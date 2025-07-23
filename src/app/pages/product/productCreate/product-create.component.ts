import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
@Component({
    selector: 'app-product-create',
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
        ToastModule
    ],
    providers: [MessageService, ProductService],
    templateUrl: './product-create.component.html',
})
export class ProductCreateComponent {
    product: Partial<Product> = {
        name: '',
        description: '',
        price: 0,
        unit: 'kg',
        quantityAvailable: 0,
        imageUrls: [],  // Now an array
        harvestDate: new Date().toISOString().split('T')[0]
    };

    unitOptions = ['kg', 'g', 'lb', 'oz', 'piece', 'bunch'];
    loading = false;
    selectedFiles: File[] = [];
    previewUrls: (string | ArrayBuffer)[] = [];
    maxImages = 4;

    constructor(
        private productService: ProductService,
        private messageService: MessageService,
        private router: Router
    ) { }

    onSubmit() {
        this.loading = true;

        const productToCreate: Product = {
            ...this.product,
            price: Number(this.product.price),
            quantityAvailable: Number(this.product.quantityAvailable),
            farmerId: 1, // This should come from auth service in a real app
            harvestDateStr: this.product.harvestDate || new Date().toISOString().split('T')[0]
        } as Product;

        // First create the product
        this.productService.createProduct(productToCreate).subscribe({
            next: (createdProduct) => {
                // If there's an image to upload, do it after product creation
                if (this.selectedFiles) {
                    this.uploadImages(createdProduct.id);
                } else {
                    this.onSuccess();
                }
            },
            error: (err) => {
                this.handleError('Failed to create product');
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
                this.handleError('Product created but image upload failed');
            }
        });
    }

    private onSuccess() {
        this.resetForm();
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product created successfully'
        });
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
        this.router.navigate(['/products']);
    }

    private resetForm() {
        this.product = {
            name: '',
            description: '',
            price: 0,
            unit: 'kg',
            quantityAvailable: 0,
            imageUrls: [],
            harvestDate: new Date().toISOString().split('T')[0]
        };
        this.selectedFiles = [];
        this.onClearAllImages();
    }
}