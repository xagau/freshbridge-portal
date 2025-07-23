import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'formatText'
})
export class FormatTextPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }

    transform(text: string): SafeHtml {
        if (!text) return '';

        // Convert line breaks to <br>
        let formattedText = text.replace(/\n/g, '<br>');

        // Format numbered lists (1., 2., etc.)
        formattedText = formattedText.replace(/(\d+\.\s)/g, '<strong>$1</strong>');

        return this.sanitizer.bypassSecurityTrustHtml(formattedText);
    }
}