<script lang="ts" setup>
import {useCommonStore} from "@/store/common.ts";

let commonStore = useCommonStore();
</script>

<template>
  <v-dialog
      v-model="commonStore.isLoading"
      persistent
      width="250"
  >
    <v-list
        v-if="commonStore.isLoading"
        class="py-2"
        color="primary"
        elevation="12"
        rounded="lg"
    >
      <v-list-item
          title="Loading..."
      >
        <template v-slot:prepend>
          <div class="pe-10">
            <v-progress-circular
                color="primary"
                indeterminate="disable-shrink"
                size="30"
                width="3"
            ></v-progress-circular>
          </div>
        </template>
      </v-list-item>
    </v-list>
  </v-dialog>
</template>
