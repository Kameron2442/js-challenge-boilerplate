import { Component, inject, OnInit } from '@angular/core';
import { HomePolicy } from '../../../interfaces/policy';
import { HomePolicyUploadsStore } from '../../../stores/home-policy-store';

@Component({
    selector: 'app-policy-reader',
    imports: [],
    templateUrl: './policy-reader.component.html',
    styleUrl: './policy-reader.component.scss'
})
export class PolicyReaderComponent implements OnInit {

    public policyStore = inject(HomePolicyUploadsStore);

    private readonly fileErrorMissingHeader = 'Your file is missing a PolicyNumber column. Please reupload your file with the column included.';
    private readonly fileErrorMissingRows = 'Your file is missing data under the header row. Please reupload your file with the rows included.';
    private readonly fileErrorFileEmpty = 'Your file is empty. Please reupload with data included.';
    private readonly fileErrorTooLarge = 'Your file is too large. Please reupload a file under 2MB.';
    private readonly fileErrorUnknown = 'Your file has an unknown issue that prevents processing. Please open an incident ticket for resolution.';
    private readonly maxFileSizeBytes: number = 2000000;
    private readonly policyNumberHeader = 'PolicyNumber';
    private reader = new FileReader();

    ngOnInit(): void {
        this.reader.onload = () => {
            const text = this.reader.result as string;
            const homePolicies: HomePolicy[] | null = this.parseCSV(text);

            if (homePolicies) {
                this.policyStore.addFileUpload(homePolicies);
            }
        };

        this.reader.onerror = () => {
            this.policyStore.setUploadError(this.fileErrorUnknown);
        }
    }

    readCSV(event: Event): void {
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
            this.policyStore.setUploadError(this.fileErrorUnknown);
        }
    }

    parseCSV(csvText: string): HomePolicy[] | null {
        const lines = csvText.trim().split('\n');
        const firstLine = lines.shift();

        if(this.csvHasErrors(firstLine, lines)){
            return null;
        }

        return lines.map(line => {
            let rowData: string[] = line.split(',').map(cell => cell.trim());

            let ids = Number(rowData[0]);
            let policyNumbers = rowData[1];

            let tempData: HomePolicy = {
                id: ids,
                policyNumber: policyNumbers,
                valid: this.checkSum(policyNumbers)
            };
            return tempData;
        });
    }

    csvHasErrors(firstLine: string | undefined, rows: string[]){
        let hasError = false;

        try {
            if (firstLine === '') {
                this.policyStore.setUploadError(this.fileErrorFileEmpty);
                hasError = true;
            } else if (!firstLine!.includes(this.policyNumberHeader)) {
                this.policyStore.setUploadError(this.fileErrorMissingHeader);
                hasError = true;
            } else if (rows.length === 0) {
                this.policyStore.setUploadError(this.fileErrorMissingRows);
                hasError = true;
            }
        } catch {
            this.policyStore.setUploadError(this.fileErrorUnknown);
            hasError = true;
        }

        return hasError;
    }

    checkSum(policyNumber: string): string {
        let convertedNumber = Number(policyNumber);

        if(Number.isNaN(convertedNumber)){
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


    public clearSelection($event: any) {
        $event.target.value = null;
    }

}
