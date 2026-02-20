import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked, Renderer } from 'marked';

const renderer = new Renderer();

// Open all links from AI responses in a new tab
renderer.link = ({ href, title, text }: { href: string; title?: string | null; text: string }) => {
    const titleAttr = title ? ` title="${title}"` : '';
    return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
};

marked.use({ renderer });

@Pipe({
    name: 'formatText'
})
export class FormatTextPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }

    transform(text: string): SafeHtml {
        if (!text) return '';
        const html = marked.parse(text) as string;
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }
}