import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyReaderComponent } from './policy-reader.component';

describe('PolicyReaderComponent', () => {
    let component: PolicyReaderComponent;
    let fixture: ComponentFixture<PolicyReaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PolicyReaderComponent]
        })
        .compileComponents();

        fixture = TestBed.createComponent(PolicyReaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
    expect(component).toBeTruthy();
    });
});
