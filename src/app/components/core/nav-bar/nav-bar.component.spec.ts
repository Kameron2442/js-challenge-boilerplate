import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarComponent } from './nav-bar.component';

describe('NavBarComponent', () => {
    let component: NavBarComponent;
    let componentElement: HTMLElement;
    let fixture: ComponentFixture<NavBarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NavBarComponent]
        })
        .compileComponents();

        fixture = TestBed.createComponent(NavBarComponent);
        component = fixture.componentInstance;
        componentElement = fixture.debugElement.nativeElement;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a title', () => {
        const siteTitle = componentElement.querySelector('.nav-bar__title')!;
        expect(siteTitle.textContent).toEqual(`Kameron's Code Challenge`);
    });

    it('should flip the theme boolean when the theme button is clicked', () => {
        const themeButton = componentElement.querySelector('.nav-bar__theme-button') as HTMLButtonElement;
        expect(component.showLightTheme()).toBeFalse();
        themeButton.click();
        expect(component.showLightTheme()).toBeTruthy();
        themeButton.click();
        expect(component.showLightTheme()).toBeFalse();
    });
    
});
