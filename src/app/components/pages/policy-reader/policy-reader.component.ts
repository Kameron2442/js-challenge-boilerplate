import { Component } from '@angular/core';
import { HomePolicy } from '../../../interfaces/policy';

@Component({
    selector: 'app-policy-reader',
    imports: [],
    templateUrl: './policy-reader.component.html',
    styleUrl: './policy-reader.component.scss'
})
export class PolicyReaderComponent {

    policy1: HomePolicy = {
        id: 0,
        policyNumber: 100,
        valid: false
    }

    policy2: HomePolicy = {
        id: 0,
        policyNumber: 200,
        valid: false
    }

    policy3: HomePolicy = {
        id: 0,
        policyNumber: 300,
        valid: false
    }

    policyNumbers: HomePolicy[] = [
        this.policy1, this.policy2, this.policy3
    ]

    readCSV(event: Event): void {
     
    }



}
