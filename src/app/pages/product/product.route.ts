import { Routes } from '@angular/router';
import { ProductCreateComponent } from './productCreate/product-create.component';
import { ProductList } from './productlist/productlist.component';
import { ProductOverview } from "./productoverview/productoverview";
import { ProductUpdateComponent } from './productUpdate/product-update.component';

export default [
    { path: '', data: { breadcrumb: 'Product List' }, component: ProductList },
    { path: 'create', data: { breadcrumb: 'Create Product' }, component: ProductCreateComponent },
    { path: 'overview/:id', data: { breadcrumb: 'Product Overview' }, component: ProductOverview },
    { path: 'update/:id', data: { breadcrumb: 'Update Product' }, component: ProductUpdateComponent }
] as Routes;
