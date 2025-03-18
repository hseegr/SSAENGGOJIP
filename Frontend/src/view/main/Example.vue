<script lang="ts" setup>
import {ref} from "vue";

interface Example {
  title: string,
  text: string,
  icon?: string,
}

const examples = ref<Example[]>([
  {
    title: "프로젝트 팀 관리 도구",
    text: "회사에서 새로운 프로젝트 팀이 만들어질 때마다 팀 구성원 추가, 채널 생성, 역할 배정 등의 자동화 서비스를 개발할 수 있습니다.",
    icon: "mdi-tools",
  },
  {
    title: "자동 알림 봇",
    text: "중요 일정이나 이슈 발생 시 팀원들에게 자동 알림을 전송해주는 봇을 구축 할 수 있습니다.",
    icon: "mdi-bell-ring",
  },
  {
    title: "AI 기반 이슈 자동 분류 시스템",
    text: "팀 내 다양한 이슈가 Mattermost 채널에 게시되는데, 이를 자동으로 분류하고 연관 태그를 추가할 수 있습니다.",
    icon: "mdi-saw-blade",
  },
  {
    title: "AI 기반 코드 리뷰어 봇",
    text: "개발팀이 Mattermost에 코드 스니펫을 게시하면, AI가 이를 분석하고 개선 사항을 제안해주는 봇을 개발 할 수 있습니다.",
    icon: "mdi-robot",
  },
  {
    title: "통합 사용자 인증 시스템",
    text: "단일 로그인(SSO)을 통해 다양한 서비스 간 자유로운 이동성을 제공할수 있으며, 이를 통해 사용자에게 단일 서비스와 같은 경험을 제공 할 수 있습니다.",
    icon: "mdi-account-check",
  },
  {
    title: "내부 시스템 통합 인증",
    text: "조직원들이 하나의 SSO로 조직 내 다양한 시스템에 접근 가능하도록 설정 할 수 있습니다.",
    icon: "mdi-share-variant",
  },
  {
    title: "AI 기반 보안 위협 탐지 및 예방 시스템",
    text: "AI를 통해 로그인 패턴을 분석하여 비정상적 로그인 시도를 감지하고, 즉시 경고 및 조치를 취할 수 있습니다.",
    icon: "mdi-lock",
  },
  {
    title: "사용자 맞춤형 서비스 제공 시스템",
    text: "AI를 통해 사용자 데이터를 분석하여 맞춤형 콘텐츠 및 서비스를 자동으로 추천해주는 서비스를 개발 할수 있습니다.",
    icon: "mdi-account-search",
  },
]);

interface Sample {
  title: string,
  img: string,
  link?: string,
}

const samples = ref<Sample[]>([
  {
    title: "프로젝트 모집",
    img: "superapp_sample_txt_01.png",
  },
  {
    title: "Flow Studio",
    img: "sample_flowstudio.png",
    link: "https://flowstudio.ssafyapp.com/",
  },
  {
    title: "SSAFFICE",
    img: "sample_ssaffice.png",
    link: "https://ssaffice.ssafyapp.com/landing",
  },
  {
    title: "열정 2배",
    img: "superapp_sample_02.png",
  }
])
</script>
<template>
  <div
      class="pa-10 flex-c align-center"
  >
    <div class="title-font my-5">
      이렇게 <span class="text-primary">활용</span>하세요.
    </div>
    <v-sheet
        class="d-flex justify-center w-100"
    >
      <v-slide-group
          mandatory
          show-arrows
      >
        <v-slide-group-item
            v-for="(example, index) in examples"
            :key="'example'+index"
            v-slot="{ isSelected, toggle }"
        >
          <v-card
              :color="isSelected ? 'primary' : 'grey-lighten-5'"
              :hover="true"
              :variant="isSelected ? 'tonal': 'flat'"
              class="ma-5 pa-10"
              height="300"
              rounded="xl"
              width="530"
              @click="toggle"
          >
            <v-icon
                :icon="example.icon"
                class="mb-5"
            />
            <div class="body-font-lg text-primary-darken">
              {{ example.title }}
            </div>
            <div class="body-font text-primary-darken">
              {{ example.text }}
            </div>
          </v-card>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
  </div>
  <div
      class="px-10 flex-c align-center"
  >
    <div class="title-font mb-5">
      교육생 <span class="text-primary">활용 프로젝트</span>를 확인하세요.
    </div>
    <v-sheet
        class="d-flex justify-center w-100"
    >
      <v-slide-group
          mandatory
          show-arrows
      >
        <v-slide-group-item
            v-for="(sample, index) in samples"
            :key="'sample'+index"
        >
          <v-card
              :hover="true"
              :href="sample.link"
              class="ma-5"
              color="grey-lighten-5"
              height="400"
              rounded="xl"
              target="_blank"
              variant="flat"
              width="400"
          >
            <div class="body-font-lg text-primary-darken mx-5 my-2">
              {{ sample.title }}
            </div>
            <v-img
                :src="'/src/assets/img/main/sample/'+sample.img"
                width="700"
            />
          </v-card>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
  </div>
</template>
