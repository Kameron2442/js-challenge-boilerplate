import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PolicyReaderComponent } from './policy-reader.component';
import { HomePolicyUploadsStore } from '../../../stores/home-policy-store';
import { fromEvent, take } from 'rxjs';

const validPolicyNumber: string = '457508000'
const invalidPolicyNumber: string = '664371495'
const badPolicyNumber: string = '66437ab1495'

const emptyFileData: string = '';
const emptyFile = new File([emptyFileData], 'test.csv', { type: 'text/csv' });

const goodFileChecksumData: string = validPolicyNumber + ',' + invalidPolicyNumber + ',' + badPolicyNumber;
const goodFileChecksum = new File([goodFileChecksumData], 'test.csv', { type: 'text/csv' });

const goodFileLargeData: string = '457500000,664371495,333333333,45750800,555555555,666666666,777777777,861100036,861100036,123456789';
const goodFileLarge = new File([goodFileLargeData], 'test.csv', { type: 'text/csv' });

const badFileData: string = '457500000,664371495,333333333,45750800,555555555,666666666,777777777,861100036,861100036,123456789';
const badFile = new File([badFileData], 'a', { type: 'text/csv' });

const tooLargFileData: string = '457500000,664371495,333333333,45750800,555555555,666666666,777777777,861100036,861100036,123456789';
const tooLargFile = new File([tooLargFileData], 'test.csv', { type: 'text/csv' });
Object.defineProperty(tooLargFile, 'size', {
  value: 3000000, // 3 MB
});

function uploadFile(componentElement: HTMLElement, file: File) {
    const fileInput = componentElement.getElementsByClassName('file-upload__input')[0];
    Object.defineProperty(fileInput, 'files', {
        value: [file],
    });
    fileInput.dispatchEvent(new Event('change'));
}

describe('PolicyReaderComponent', () => {
    let component: PolicyReaderComponent;
    let componentElement: HTMLElement;
    let fixture: ComponentFixture<PolicyReaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PolicyReaderComponent],
            providers: [HomePolicyUploadsStore]
        })
        .compileComponents();

        fixture = TestBed.createComponent(PolicyReaderComponent);
        component = fixture.componentInstance;
        componentElement = fixture.debugElement.nativeElement;
        spyOn(component.policyStore, 'startUploadProcessing').and.callThrough();

    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should load a valid file into the signal store and display its contents', (done) => {
        fixture.detectChanges();

        uploadFile(componentElement, goodFileLarge);
        expect(component.policyStore.uploadCount()).toEqual(0)

        fromEvent(component.reader, 'load').pipe(take(1)).subscribe(() => {
            fixture.detectChanges();
            const policyRows = componentElement.getElementsByClassName('csv-table__rows');
            expect(policyRows.length).toEqual(10)
            expect(component.policyStore.uploadCount()).toEqual(1)
            done();
        });
    });

    it('Should have a table of three rows with correct policy numbers from the file', (done) => {
        fixture.detectChanges();

        uploadFile(componentElement, goodFileChecksum);
        expect(component.policyStore.uploadCount()).toEqual(0)

        fromEvent(component.reader, 'load').pipe(take(1)).subscribe(() => {
            fixture.detectChanges();
            const policyNumbers = componentElement.getElementsByClassName('csv-table__number');
            expect(policyNumbers.length).toEqual(3)
            expect(policyNumbers[0].textContent).toEqual(validPolicyNumber)
            expect(policyNumbers[1].textContent).toEqual(invalidPolicyNumber)
            expect(policyNumbers[2].textContent).toEqual(badPolicyNumber)
            done();
        });
    });

    it('Should have a table of three rows with correct policy number checksum validations', (done) => {
        fixture.detectChanges();

        uploadFile(componentElement, goodFileChecksum);
        expect(component.policyStore.uploadCount()).toEqual(0)

        fromEvent(component.reader, 'load').pipe(take(1)).subscribe(() => {
            fixture.detectChanges();
            const policyNumbers = componentElement.getElementsByClassName('csv-table__valid');
            expect(policyNumbers.length).toEqual(3)
            expect(policyNumbers[0].textContent).toEqual('Valid')
            expect(policyNumbers[1].textContent).toEqual('Invalid')
            expect(policyNumbers[2].textContent).toEqual('Not a number')
            done();
        });
    });

    it('should display an error banner and not store any data when a file is over 2mb', () => {
        fixture.detectChanges();

        uploadFile(componentElement, tooLargFile);
        expect(component.policyStore.uploadCount()).toEqual(0)
        fixture.detectChanges();

        const errorBanner = componentElement.getElementsByClassName('error-banner')[0];
        expect(errorBanner.textContent).toContain("Your file is too large. Please reupload a file under 2MB.")
        expect(component.policyStore.uploadCount()).toEqual(0)
    });

    it('should display an error banner and not store any data when a file has some kind of internal error', () => {
        fixture.detectChanges();

        // Dispatch event with no file
        const fileInput = componentElement.getElementsByClassName('file-upload__input')[0];
        fileInput.dispatchEvent(new Event('change'));
        fixture.detectChanges();

        const errorBanner = componentElement.getElementsByClassName('error-banner')[0];
        expect(errorBanner.textContent).toContain("Your file has an issue that prevents processing. Please open an incident ticket for resolution.")
        expect(component.policyStore.uploadCount()).toEqual(0)
    });

    it('should display an error banner and not store any data when a file has some kind of internal error', () => {
        fixture.detectChanges();

        // Dispatch event with no file
        const fileInput = componentElement.getElementsByClassName('file-upload__input')[0];
        fileInput.dispatchEvent(new Event('change'));
        fixture.detectChanges();

        const errorBanner = componentElement.getElementsByClassName('error-banner')[0];
        expect(errorBanner.textContent).toContain("Your file has an issue that prevents processing. Please open an incident ticket for resolution.")
        expect(component.policyStore.uploadCount()).toEqual(0)
    });

    it('should display an error banner and not store any data when a file is empty', (done) => {
        fixture.detectChanges();

        uploadFile(componentElement, emptyFile);
        expect(component.policyStore.uploadCount()).toEqual(0)

        fromEvent(component.reader, 'load').pipe(take(1)).subscribe(() => {
            fixture.detectChanges();
            const errorBanner = componentElement.getElementsByClassName('error-banner')[0];
            expect(errorBanner.textContent).toContain("Your file is empty. Please reupload with data included.")
            expect(component.policyStore.uploadCount()).toEqual(0)
            done();
        });
    });

    it('should prevent double submissions while an existing upload is processing', () => {
        fixture.detectChanges();

        const fileInput = componentElement.getElementsByClassName('file-upload__input')[0];
        Object.defineProperty(fileInput, 'files', {
            value: [goodFileLarge],
        });
        fileInput.dispatchEvent(new Event('change'));        
        fileInput.dispatchEvent(new Event('change'));        

        expect(component.policyStore.startUploadProcessing).toHaveBeenCalledTimes(1)
    });


});


        