import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input } from '@angular/core';
@Component({
    selector: 'app-lazy-image-widget',
    standalone: true,
    imports: [CommonModule],
    template: `
        <img
            [src]="isIntersecting ? src : ''"
            [alt]="alt"
            [class]="className"
            [ngClass]="{
                'opacity-0': !isLoaded,
                'transition-opacity duration-700 ease-out delay-75': true
            }"
            (load)="handleLoad()"
            #image
        />
    `
})
export class LazyImageWidget {
    @Input() src: string = '';
    @Input() alt: string = '';
    @Input() className: string = '';

    isIntersecting = false;
    isLoaded = false;
    imageElement: HTMLElement | undefined;

    constructor(private el: ElementRef) {}

    ngOnInit() {
        this.imageElement = this.el.nativeElement.querySelector('img');

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
                    this.isIntersecting = true;
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        if (this.imageElement) {
            observer.observe(this.imageElement);
        }
    }

    ngOnDestroy() {
        if (this.imageElement) {
            this.imageElement = undefined;
        }
    }

    handleLoad() {
        this.isLoaded = true;
    }
}
