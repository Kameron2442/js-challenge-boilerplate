import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HomePolicy } from '../../../interfaces/policy';
import { HomePolicyUploadsStore } from '../../../stores/home-policy-store';
import { fromEvent, Subscription } from 'rxjs';

@Component({
    selector: 'app-policy-reader',
    imports: [],
    templateUrl: './policy-reader.component.html',
    styleUrl: './policy-reader.component.scss'
})
export class PolicyReaderComponent implements OnInit, OnDestroy {

    @ViewChild('inputLabel') public inputLabel: ElementRef | undefined;

    public policyStore = inject(HomePolicyUploadsStore);

    public reader = new FileReader();
    private readerLoadSubscription!: Subscription;
    private readerErrorSubscription!: Subscription;
    private readonly fileErrorFileEmpty = 'Your file is empty. Please reupload with data included.';
    private readonly fileErrorTooLarge = 'Your file is too large. Please reupload a file under 2MB.';
    private readonly fileErrorSupport = 'Your file has an issue that prevents processing. Please open an incident ticket for resolution.';
    private readonly maxFileSizeBytes: number = 2000000;

    ngOnInit(): void {
        this.readerLoadSubscription = fromEvent(this.reader, 'load').subscribe(() => {
            const text = this.reader.result as string;
            const homePolicies: HomePolicy[] | null = this.parseCSV(text);

            if (homePolicies) {
                console.log("script:: " + this.policyStore.uploadCount())
                this.policyStore.addFileUpload(homePolicies);
                console.log("script:: " + this.policyStore.uploadCount())
            }
        });

        this.readerErrorSubscription = fromEvent(this.reader, 'error').subscribe(() => {
            this.policyStore.setUploadError(this.fileErrorSupport);
        });
    }

    // Entry point after a csv file is first uploaded
    public uploadCSV(event: Event): void {

        // Prevent double submits
        if(this.policyStore.uploadProcessing()){
            return;
        }
        
        // Set the state of the reader as in progress
        this.policyStore.startUploadProcessing();

        try {
            const target = event.target as HTMLInputElement;
            const file = target.files![0] as File;

            if (file.size > this.maxFileSizeBytes) {
                this.policyStore.setUploadError(this.fileErrorTooLarge);
                return;
            }

            this.reader.readAsText(file);
        } catch {
            this.policyStore.setUploadError(this.fileErrorSupport);
        }
    }

    // Read the contents of the csv file and turn the data into objects
    private parseCSV(csvText: string): HomePolicy[] | null {
        if (csvText === '') {
            this.policyStore.setUploadError(this.fileErrorFileEmpty);
            return null;
        }

        const csvPolicyNumbers = csvText.trim().split(',');

        return csvPolicyNumbers.map((line, index) => {
            let tempData: HomePolicy = {
                id: index + 1,
                policyNumber: line,
                valid: this.checkSum(line)
            };
            return tempData;
        });
    }

    // Calculate the checksum for a policy number if possible
    private checkSum(policyNumber: string): string {
        let convertedNumber = Number(policyNumber);

        if (Number.isNaN(convertedNumber)) {
            return 'Not a number';
        }

        let chars: string[] = policyNumber.toString().split("");
        let totalLength = chars.length;
        let totalSum = 0;
        chars.forEach((elem) => {
            totalSum += Number(elem) * totalLength;
            totalLength--;
        });

        if (totalSum % 11 === 0) {
            return 'Valid';
        } else {
            return 'Invalid';
        }
    }

    // Removes the previously selected input file so that its (change) event can always trigger
    public clearSelection($event: any) {
        $event.target.value = null;
    }

    // Allows for the enter and space keys to trigger an input file select
    public clickLabel() {
        this.inputLabel?.nativeElement.click();
    }

    ngOnDestroy(): void {
        this.readerLoadSubscription.unsubscribe();
        this.readerErrorSubscription.unsubscribe();
    }

}
