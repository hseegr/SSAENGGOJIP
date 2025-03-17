<script lang="ts" setup>
import CommonDialog from "@/components/common/CommonDialog.vue";
import CommonLoading from "@/components/common/CommonLoading.vue";
</script>

<template>
  <v-app>
    <RouterView></RouterView>
    <common-dialog/>
    <common-loading/>
  </v-app>
</template>


