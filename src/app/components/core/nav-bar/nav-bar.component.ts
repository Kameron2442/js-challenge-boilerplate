import { Component, inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'app-nav-bar',
    imports: [],
    templateUrl: './nav-bar.component.html',
    styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {

    private document = inject(DOCUMENT);
    private renderer = inject(Renderer2);
    protected showLightTheme: boolean = false;

    protected flipTheme(): void {
        this.showLightTheme = !this.showLightTheme;
        this.showLightTheme ? this.setTheme('light') : this.setTheme('dark');
    }

    private setTheme(theme: string): void {
        this.renderer.setAttribute(this.document.documentElement, 'data-theme', theme);
    }
    
}