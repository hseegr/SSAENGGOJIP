<script lang="ts" setup>
import {useCommonStore} from "@/store/common.ts";
import {onMounted} from "vue";

const commonStore = useCommonStore();

onMounted(() => {
  commonStore.setBreadCrumbs(["Home"]);
})
</script>

<template>
  <v-card flat>
    <v-card-text>
      <div>
        SSAFY 교육생 여러분 반갑습니다. <br><br>
        <b>본 프로젝트</b>는 SSAFY 교육생에게 제공되는 예제 프로젝트로서, <br>
        SSAFY가 제공하는 OpenAPI를 포함하여 SSAFY 개발자 센터에서 제공하는 서비스들을 <br>
        빠르게 적용 할 수 있도록 도와주며, 나아가 자신의 특화 서비스 개발에 집중 할 수 있는 환경을 제공합니다.
      </div>
    </v-card-text>
  </v-card>
</template>

