import { Component } from '@angular/core';
import { NavBarComponent } from "./components/core/nav-bar/nav-bar.component";
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    standalone: true,
    imports: [NavBarComponent, RouterOutlet]
})
export class AppComponent {
    title = 'kin-ocr';
}
