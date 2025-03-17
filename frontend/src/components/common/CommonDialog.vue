<template>
  <v-dialog v-for="(info, index) in commonDialogInfos" :key="index"
            v-model="info.show"
            persistent
            width="auto"
            @afterLeave="deleteCommonDialog(info.dialogId)"
  >
    <v-card
        :title="info.title"
        min-width="500"
    >
      <template v-slot:prepend>
        <v-icon
            :color="getColor(info.type)"
            :icon="getIcon(info.type)"
            size="x-large"/>
      </template>
      <template v-slot:text>
        <div v-html="replaceNewLineChar(info.message)"></div>
      </template>
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn
            v-if="info.useCancel"
            class="ms-auto"
            text="Cancel"
            @click="close(false, info.dialogId)"
        ></v-btn>
        <v-btn
            class="ms-auto"
            color="primary"
            text="Ok"
            @click="close(true, info.dialogId)"
        ></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {useCommonDialog} from "@/store/commonDialog.ts";

export type CommonDialogType = 'success' | 'info' | 'warn' | 'error' | 'question';

export interface CommonDialogInfo {
  dialogId?: string;
  title: string;
  type: CommonDialogType;
  message: string;
  useCancel: boolean;
  okLabel?: string;
  cancelLabel?: string;
  resolve: (value: boolean) => void;
  reject: (reason?: any) => void;
  show: boolean,
}

export default defineComponent({
  name: "CommonDialog",
  setup() {
    let commonDialog = useCommonDialog();
    return {
      commonDialogInfos: commonDialog.commonDialogInfos,
      deleteCommonDialog: commonDialog.deleteCommonDialog,
    }
  },
  methods: {
    close(isOk: boolean, dialogId?: string) {
      let targetDialog = this.commonDialogInfos.find(i => i.dialogId === dialogId);
      if (targetDialog) {
        if (targetDialog.resolve) {
          targetDialog.resolve(isOk);
        }
        targetDialog.show = false;
      }
    },
    
    getIcon(type: CommonDialogType) {
      switch (type) {
        case "success":
          return 'mdi-check-circle';
        case "info":
          return 'mdi-information';
        case "warn":
          return 'mdi-alert-box';
        case "error":
          return 'mdi-alert-octagram';
        case "question":
          return 'mdi-help-circle';
        
      }
    },
    getColor(type: CommonDialogType) {
      switch (type) {
        case "question":
        case "info":
          return 'info';
        case "warn":
          return 'warning';
        case "error":
          return 'error';
        case "success":
          return 'success';
      }
    },
    replaceNewLineChar(input: any) {
      if (typeof input === 'string' || input instanceof String) {
        return input.replace(/(?:\r\n|\r|\n)/g, '<br>');
      } else {
        return JSON.stringify(input);
      }
    },
  }
})
</script>
