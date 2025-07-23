import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutService } from '@/layout/service/layout.service';

@Component({
    selector: 'auth-layout',
    standalone: true,
    imports: [RouterModule],
    template: `
        <main>
            <router-outlet></router-outlet>
        </main>
        <!-- <button class="layout-config-button config-link" (click)="layoutService.toggleConfigSidebar()">
            <i class="pi pi-cog"></i>
        </button> -->
    `
})
export class AuthLayout {
    layoutService: LayoutService = inject(LayoutService);
}
