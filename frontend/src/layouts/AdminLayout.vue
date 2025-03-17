<script lang="ts" setup>
import {computed, ref} from "vue";
import {useCommonStore} from "@/store/common.ts";
import NavDrawer from "@/components/admin/NavDrawer.vue";

let commonStore = useCommonStore();
let breadCrumbs = computed(() => commonStore.breadCrumbs);

const drawer = ref(true);
</script>

<template>
  <div class="admin">
    <nav-drawer />
    <div class="page px-10">
      <v-breadcrumbs
        :items="breadCrumbs"
        class="pa-4"
      >
        <template #prepend>
          <v-btn
            v-show="!drawer.valueOf()"
            class="mr-5"
            density="compact"
            icon="mdi-menu"
            @click="drawer = true"
          />
          <v-icon
            icon="mdi-home"
            size="small"
          />
          <v-icon icon="mdi-chevron-right" />
        </template>
        <template #divider>
          <v-icon icon="mdi-chevron-right" />
        </template>
      </v-breadcrumbs>
      <v-divider />
      <router-view />
    </div>
    <div class="footer px-10">
      <img
        alt="logo_footer"
        src="@/assets/img/logo_footer.png"
      >
      <span class="ml-3">© SAMSUNG</span>
    </div>
  </div>
</template>

<style scoped>
.page {
  flex: 1;
  overflow: auto;
}
</style>
