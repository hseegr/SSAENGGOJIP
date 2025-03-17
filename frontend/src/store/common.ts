import {defineStore} from "pinia";

export const useCommonStore = defineStore("common", {
    state() {
        return {
            breadCrumbs: [] as string[],
            isLoading: false as boolean,
            loadingRefCount: 0,
        };
    },
    actions: {
        setBreadCrumbs(breadCrumbs: string[]) {
            this.breadCrumbs = breadCrumbs;
        },
        startLoading() {
            this.isLoading = true;
            this.loadingRefCount++;
        },
        endLoading() {
            if (this.loadingRefCount > 0) {
                this.loadingRefCount--;
                this.isLoading = this.loadingRefCount > 0;
            }
        }
    },
});
