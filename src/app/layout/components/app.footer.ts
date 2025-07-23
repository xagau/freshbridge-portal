import { Component, computed, inject } from '@angular/core';
import { LayoutService } from '@/layout/service/layout.service';

@Component({
    selector: '[app-footer]',
    standalone: true,
    template: `
        <div class="layout-footer">
            <div class="footer-logo-container">
                <img src="/images/{{ isDarkTheme() ? 'logo-white.png' : 'logo.png' }}" alt="fresh-bridge-layout" />
            </div>
            <span class="footer-copyright">&#169; freshbridge.ca - 2025</span>
        </div>
    `
})
export class AppFooter {
    layoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());
}
