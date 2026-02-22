import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Pipe({
    name: 'formatText'
})
export class FormatTextPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }

    transform(text: string): SafeHtml {
        if (!text) return '';
        try {
            const html = (marked.parse(text) as string)
                .replace(/<a\s+href=/g, '<a target="_blank" rel="noopener noreferrer" href=');
            return this.sanitizer.bypassSecurityTrustHtml(html);
        } catch {
            // Fallback: basic newline-to-br conversion
            return this.sanitizer.bypassSecurityTrustHtml(text.replace(/\n/g, '<br>'));
        }
    }
}