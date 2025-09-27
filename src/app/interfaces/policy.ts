// Represents a file upload of home insurance policies
export interface HomePolicyUpload {
    id: number;
    homePolicies: HomePolicy[];
    fileName: string;
}

// Represents a home insurance policy item
export interface HomePolicy {
    id: number;
    policyNumber: string;
    valid: string;
}