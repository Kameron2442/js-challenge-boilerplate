import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { HomePolicy } from '../interfaces/policy';
import { computed } from '@angular/core';

type HomePolicyUploadsState = {
    homePolicyUploads: HomePolicy[][];    // Stores history of all file uploads
    uploadProcessing: boolean;            // Stores an indicator of when processing starts/ends. Can be used to show loading indicators.
    uploadError: string | null;           // Stores an error from a failed file upload
};

const initialState: HomePolicyUploadsState = {
    homePolicyUploads: [],
    uploadProcessing: false,
    uploadError: null
};

export const HomePolicyUploadsStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed(({homePolicyUploads}) => ({
        uploadCount: computed(() => homePolicyUploads().length),
        mostRecentUpload: computed(() => homePolicyUploads()[0])
    })),
    withMethods((store) => ({
        addFileUpload(homePolicies: HomePolicy[]): void {
            patchState(store, (state) => ({ homePolicyUploads: [homePolicies, ...state.homePolicyUploads], uploadProcessing: false }))
        },
        startUploadProcessing(): void {
            patchState(store, (state) => ({ uploadProcessing: true, uploadError: null }))
        },
        setUploadError(uploadErrorMsg: string): void {
            patchState(store, (state) => ({ uploadProcessing: false, uploadError: uploadErrorMsg }))
        }
    }))
);

