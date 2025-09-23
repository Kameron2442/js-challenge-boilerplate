import { Component } from '@angular/core';
import { NavBarComponent } from "./components/core/nav-bar/nav-bar.component";
import { FooterComponent } from "./components/core/footer/footer.component";
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    standalone: true,
    imports: [NavBarComponent, FooterComponent, RouterOutlet]
})
export class AppComponent {
  title = 'kin-ocr';
}
