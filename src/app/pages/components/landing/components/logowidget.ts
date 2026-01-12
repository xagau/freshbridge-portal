import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LayoutService } from '@/layout/service/layout.service';
import { inject, computed } from '@angular/core';
@Component({
    selector: 'logo-widget',
    standalone: true,
    imports: [CommonModule],
    template: ` <img [ngClass]="[className, reverseTheme ? 'fill-surface-0 dark:fill-surface-900' : 'fill-surface-900 dark:fill-surface-0']" [src]="'/images/' + (isDarkTheme() ? 'logo-white.png' : 'logo.png')" alt="Image" width="152" height="32" />`
})
export class LogoWidget {
    @Input() className: string = '';
    @Input() reverseTheme: boolean = false;
    layoutService = inject(LayoutService);
    isDarkTheme = computed(() => this.layoutService.isDarkTheme());
}
