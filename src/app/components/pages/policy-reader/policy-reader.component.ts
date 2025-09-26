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
    private readonly numberRegex = new RegExp(/^[0-9]+$/);

    ngOnInit(): void {
        this.readerLoadSubscription = fromEvent(this.reader, 'load').subscribe(() => {
            const text = this.reader.result as string;
            const homePolicies: HomePolicy[] | null = this.parseCsv(text);

            if (homePolicies) {
                this.policyStore.addFileUpload(homePolicies);
            }
        });

        this.readerErrorSubscription = fromEvent(this.reader, 'error').subscribe(() => {
            this.policyStore.setUploadError(this.fileErrorSupport);
        });
    }

    // Entry point after a csv file is first uploaded
    public uploadCsv(event: Event): void {

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
    private parseCsv(csvText: string): HomePolicy[] | null {
        if (csvText === '') {
            this.policyStore.setUploadError(this.fileErrorFileEmpty);
            return null;
        }

        const csvPolicyNumbers = csvText.trim().split(',');

        return csvPolicyNumbers.map((policyNumber, index) => {
            let homePolicy: HomePolicy = {
                id: index + 1,
                policyNumber: policyNumber,
                valid: this.checkSum(policyNumber)
            };
            return homePolicy;
        });
    }

    // Calculate the checksum for a policy number
    private checkSum(policyNumber: string): string {
        if (!this.numberRegex.test(policyNumber) || Number.isNaN(Number(policyNumber))) {
            return 'Not a number';
        }

        const chars: string[] = policyNumber.split("");
        let totalLength = chars.length;
        let totalSum = 0;
        chars.forEach((numberItem) => {
            totalSum += Number(numberItem) * totalLength;
            totalLength--;
        });

        return totalSum % 11 === 0 ? 'Valid' : 'Invalid';
    }

    // Removes the previously selected input file so that its (change) event can always trigger
    public clearSelection(event: Event): void {
        const eventTarget = event.target as HTMLInputElement;
        eventTarget.value = null!;
    }

    // Allows for the enter and space keys to trigger an input file select
    public clickLabel(): void {
        this.inputLabel?.nativeElement.click();
    }

    ngOnDestroy(): void {
        this.readerLoadSubscription.unsubscribe();
        this.readerErrorSubscription.unsubscribe();
    }

}
