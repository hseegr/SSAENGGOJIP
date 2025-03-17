<script lang="ts" setup>
import {onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useUserStore} from "@/store/user.ts";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

onMounted(async () => {
  await userStore.fetchUserInfo();
  if (userStore.isAuthenticated) {
    await router.replace({
      path: route.query.returnPath as string || '/',
      query: JSON.parse(route.query.returnQuery as string || '{}'),
    });
  } else {
    await router.replace({
      name: 'login',
      query: route.query,
    });
  }
})
</script>

<template>
</template>


