import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { HomePolicyUpload } from '../interfaces/policy';
import { computed } from '@angular/core';

type HomePolicyUploadsState = {
    homePolicyUploads: HomePolicyUpload[];    // Stores history of all file uploads
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
        // Keep track of the total number of successful file uploads
        uploadCount: computed(() => homePolicyUploads().length),
    })),
    withMethods((store) => ({
        // When a file upload ends successfully, add it to the store
        addFileUpload(homePolicyUpload: HomePolicyUpload): void {
            patchState(store, (state) => ({ homePolicyUploads: [homePolicyUpload, ...state.homePolicyUploads], uploadProcessing: false }))
        },
        // When a file upload beings, initialized the processing state
        startUploadProcessing(): void {
            patchState(store, (state) => ({ uploadProcessing: true, uploadError: null }))
        },
        // When a file upload errors, set the error reason and end the upload processing status
        setUploadError(uploadErrorMsg: string): void {
            patchState(store, (state) => ({ uploadProcessing: false, uploadError: uploadErrorMsg }))
        }
    }))
);

