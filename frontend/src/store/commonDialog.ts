import {defineStore} from "pinia";
import {CommonDialogInfo, CommonDialogType} from "@/components/common/CommonDialog.vue";


export const useCommonDialog = defineStore("commonDialog", {
    state() {
        return {
            commonDialogInfos: [] as CommonDialogInfo[],
        };
    },
    actions: {
        showCommonDialog(info: {
            title: string,
            message: string,
            type: CommonDialogType,
            useCancel?: boolean,
            okLabel?: string,
            cancelLabel?: string,
            width?: string,
        }) {
            return new Promise<boolean>((resolve, reject) => {
                let dialogInfo: CommonDialogInfo = {
                    ...info,
                    useCancel: info.useCancel ?? false,
                    dialogId: Date.now() + '' + Math.floor(Math.random() * 10000),
                    reject,
                    resolve,
                    show: true
                }
                this.commonDialogInfos.push(dialogInfo);
            })
        },
        deleteCommonDialog(dialogId?: string) {
            let findIndex = this.commonDialogInfos.findIndex(info => info.dialogId === dialogId);
            this.commonDialogInfos.splice(findIndex, 1);
        }
    },
});
