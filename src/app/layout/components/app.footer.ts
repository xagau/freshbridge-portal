import { Component, computed, inject } from '@angular/core';
import { LayoutService } from '@/layout/service/layout.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: '[app-footer]',
    standalone: true,
    imports: [RouterModule, CommonModule],
    template: `
        <div class="layout-footer">
            <div class="footer-logo-container">
                <img src="/images/{{ isDarkTheme() ? 'logo-white.png' : 'logo.png' }}" alt="fresh-bridge-layout" />
            </div>
            <div class="flex items-center gap-4">
                <a routerLink="/terms-and-conditions" class="footer-link">Terms & Conditions</a>
                <span class="footer-copyright">&#169; freshbridge.ca - 2026</span>
            </div>
        </div>
    `
})
export class AppFooter {
    layoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());
}
