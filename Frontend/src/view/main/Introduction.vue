<script lang="ts" setup>
import {ref} from "vue";

interface Icon {
  name: string,
  width: number,
  text: string,
}

const frontendIcons = ref<Icon[]>([
  {
    name: "icon_vuejs.png",
    width: 40,
    text: "Vue.js",
  },
  {
    name: "icon_vite.png",
    width: 40,
    text: "Vite",
  },
  {
    name: "icon_vuetify.png",
    width: 40,
    text: "Vuetify",
  },
  {
    name: "icon_pinia.png",
    width: 30,
    text: "Pinia",
  }
]);

const backendIcons = ref<Icon[]>([
  {
    name: "icon_springboot.png",
    width: 40,
    text: "SpringBoot",
  },
  {
    name: "icon_jpa.png",
    width: 30,
    text: "Spring Data JPA",
  },
  {
    name: "icon_querydsl.png",
    width: 40,
    text: "Querydsl",
  },
  {
    name: "icon_mapstruct.png",
    width: 80,
    text: "Mapstruct",
  }
]);
</script>
<template>
  <div
      class="pa-10 flex-c bg-primary-gradient align-center"
  >
    <div class="title-font">
      <span class="text-primary">SSAFY 슈퍼앱</span> 환경에서<br>
    </div>
    <div class="title-font">
      바로 실행 가능한 프로젝트.
    </div>
    <v-btn
        class="ma-7 font-weight-bold"
        color="primary"
        href="https://lab.ssafy.com/ssafy-app/baseproject"
        prepend-icon="mdi-chevron-double-right"
        rounded="xl"
        size="large"
        target="_blank"
        variant="flat"
    >
      실행 환경 구성 바로가기
    </v-btn>
    <div class="d-flex flex-row justify-center ga-5 flex-wrap mb-7">
      <div class="img-sheet">
        <v-img
            max-width="800"
            min-width="300"
            src="/src/assets/img/main/introduction_ssafyapp.png"
        />
      </div>
      <div class="img-sheet">
        <v-img
            max-width="800"
            min-width="800"
            src="/src/assets/img/main/introduction_baseproject.png"
        />
      </div>
    </div>
    <div class="body-font text-secondary">
      <span class="text-black">실행 환경 구성 가이드</span>와 함께 쉽고 빠르게 프로젝트를 시작하세요.
    </div>
  </div>
  <div
      class="section bg-grey-lighten-5"
  >
    <div
        class="img-sheet flex-column align-center ga-15 py-10"
    >
      <div class="flex-r ga-15">
        <v-tooltip
            v-for="icon in frontendIcons"
            :key="icon.name"
            :text="icon.text"
            location="bottom"
        >
          <template #activator="{props}">
            <v-img
                :src="'/src/assets/img/main/icon/'+icon.name"
                :width="icon.width"
                v-bind="props"
            />
          </template>
        </v-tooltip>
      </div>
      <div class="flex-r ga-15">
        <v-tooltip
            v-for="icon in backendIcons"
            :key="icon.name"
            :text="icon.text"
            location="bottom"
        >
          <template #activator="{props}">
            <v-img
                :src="'/src/assets/img/main/icon/'+icon.name"
                :width="icon.width"
                v-bind="props"
            />
          </template>
        </v-tooltip>
      </div>
    </div>
    <div
        class="flex-c align-center flex-1"
    >
      <div
          class="flex-c section-text"
      >
        <div class="subtitle-font">
          기술 스택.
        </div>
        <div class="body-font text-secondary">
          <span class="text-black">실무에 최적화된 기술</span>들을 포함합니다.<br>
        </div>
      </div>
    </div>
  </div>
  <div
      class="section bg-grey-lighten-5"
  >
    <div
        class="flex-c align-center flex-1"
    >
      <div
          class="flex-c section-text"
      >
        <div class="subtitle-font">
          관리자 메뉴.
        </div>
        <div class="body-font text-secondary">
          다양한 <span class="text-black">관리자 메뉴</span> 덕분에,
          특화 서비스 개발에 집중할 수 있습니다.<br>
          시스템 에러를 실시간으로 확인하고, 허용 IP를 설정해보세요.<br>
          사용자 목록과 권한도 편리하게 관리할 수 있습니다.
        </div>
      </div>
    </div>
    <div class="img-sheet">
      <v-img
          max-width="1000"
          min-width="400"
          src="/src/assets/img/main/introduction_system_error.png"
      />
    </div>
  </div>
  <div
      class="section bg-grey-lighten-5"
  >
    <div class="img-sheet">
      <v-img
          max-width="1000"
          min-width="400"
          src="/src/assets/img/main/introduction_openapi.png"
      />
    </div>
    <div
        class="flex-c align-center flex-1"
    >
      <div
          class="flex-c section-text"
      >
        <div class="subtitle-font">
          SSAFY OPEN API 예제.
        </div>
        <div class="body-font text-secondary">
          <span class="text-black">SSAFY OPEN API 예제</span>를 참고하여
          개발자 센터에서 제공하는 서비스들을 빠르게 적용해보세요.
          Mattermost, SSO 등 OPEN API를 손쉽게 도입할 수 있습니다.
          지속적으로 사용자 개발을 위한 API가 추가될 예정입니다.
        </div>
      </div>
    </div>
  </div>
  <div
      class="section bg-grey-lighten-5"
  >
    <div
        class="flex-c align-center flex-1"
    >
      <div
          class="flex-c section-text"
      >
        <div class="subtitle-font">
          Swagger API Doc.
        </div>
        <div class="body-font text-secondary">
          <span class="text-black">API를 Swagger로 문서화</span>하여 제공합니다.<br>
          API 정보를 간편히 확인하고 테스트해보세요.
        </div>
      </div>
    </div>
    <div class="img-sheet">
      <v-img
          max-width="1000"
          min-width="400"
          src="/src/assets/img/main/introduction_swagger.png"
      />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.section {
  padding: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: 40px;
}

.section-text {
  width: 550px;
}

.img-sheet {
  display: flex;
  justify-content: center;
  border: 20px solid white;
  border-radius: 20px;
  background: white;
  flex: 1;
}
</style>
