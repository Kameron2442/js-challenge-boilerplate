import { Component, inject, Renderer2, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-nav-bar',
    imports: [RouterLink],
    templateUrl: './nav-bar.component.html',
    styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {

    public showLightTheme = signal(false);
    private document = inject(DOCUMENT);
    private renderer = inject(Renderer2);

    public flipTheme(): void {
        this.showLightTheme.set(!this.showLightTheme());
        this.showLightTheme() ? this.setTheme('light') : this.setTheme('dark');
    }

    private setTheme(theme: string): void {
        this.renderer.setAttribute(this.document.documentElement, 'data-theme', theme);
    }
    
}