import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '@/layout/service/layout.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { AutoFocusModule } from 'primeng/autofocus';
import { FormsModule } from '@angular/forms';

@Component({
    selector: '[app-search]',
    standalone: true,
    imports: [DialogModule, InputTextModule, AutoFocusModule, FormsModule],
    template: ` <p-dialog [(visible)]="searchBarActive" [breakpoints]="{ '992px': '75vw', '576px': '90vw' }" modal dismissableMask styleClass="w-1/2">
        <ng-template #headless>
            <div class="search-container">
                <i class="pi pi-sparkles"></i>
                <input 
                    pInputText 
                    type="text" 
                    [pAutoFocus]="true" 
                    class="p-inputtext search-input" 
                    placeholder="Fresh Select - Ask anything with AI..." 
                    [(ngModel)]="searchQuery"
                    (keydown.enter)="navigateToFreshSelect()" />
            </div>
        </ng-template>
    </p-dialog>`
})
export class AppSearch {
    layoutService = inject(LayoutService);
    router = inject(Router);
    searchQuery: string = '';

    navigateToFreshSelect() {
        // Close the search dialog
        this.layoutService.layoutState.update((value) => ({ ...value, searchBarActive: false }));
        
        // Navigate to Fresh Select page with query parameter
        if (this.searchQuery.trim()) {
            this.router.navigate(['/freshselect'], {
                queryParams: { q: this.searchQuery.trim() }
            });
        } else {
            this.router.navigate(['/freshselect']);
        }
        
        // Clear search query after navigation
        this.searchQuery = '';
    }

    toggleSearchBar() {
        this.layoutService.layoutState.update((value) => ({ ...value, searchBarActive: !value.searchBarActive }));
    }

    get searchBarActive(): boolean {
        return this.layoutService.layoutState().searchBarActive;
    }

    set searchBarActive(_val: boolean) {
        this.layoutService.layoutState.update((prev) => ({ ...prev, searchBarActive: _val }));
    }
}
