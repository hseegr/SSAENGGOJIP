<template>
  <v-form
    v-model="isValid"
    fast-fail
    @submit.prevent
  >
    <v-container class="d-flex flex-column ga-3">
      <v-text-field
        v-model="post.channelId"
        label="CHANNEL ID"
        variant="outlined"
      />
      <v-text-field
        v-model="post.id"
        :rules="[rules.required]"
        label="POST ID"
        variant="outlined"
      />
      <v-textarea
        v-model="post.message"
        hide-details
        label="MESSAGE"
        variant="outlined"
      />
      <v-row class="ga-3 ma-0 justify-end">
        <v-btn @click="getPost">
          GET_POST
        </v-btn>
        <v-btn @click="createPost">
          CREATE_POST
        </v-btn>
        <v-btn @click="putPost">
          PUT_POST
        </v-btn>
        <v-btn @click="deletePost">
          DELETE_POST
        </v-btn>
      </v-row>
      <v-textarea
        v-model="responseStr"
        auto-grow
        label="response"
        readonly
        variant="solo-filled"
      >
        {{ responseStr }}
      </v-textarea>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {createPost, deletePost, getPost, putPost} from "@/api/mattermost/MMPostApi.ts";
import {useCommonDialog} from "@/store/commonDialog.ts";
import {required} from "@/util/validationUtil.ts";
import {useCommonStore} from "@/store/common.ts";

/**
 * Mattermost API(게시물 등록/조회/수정/삭제)를 화면에서 호출하는 예제입니다.
 * 본 기능을 테스트 하기 위해선 Mattermost 기능의 사용 승인이 완료된 Open API Key가 필요하며
 * Mattermost 기능 사용 승인 이후, Application 별로 부여된 Mattermost 의 팀에서 채널을 먼저 생성해야합니다.
 *
 * 기능별 입력 값은 아래와 같습니다.
 * [GET_POST]
 * POST_ID = 가져올 게시물 ID
 *
 * [CREATE_POST]
 * CHANNEL_ID = 게시물을 등록할 채널 ID (채널 API를 통해 채널을 생성/조회하면 획득할 수 있습니다.)
 * MESSAGE = 등록할 게시물 내용
 *
 * [PUT_POST]
 * POST_ID = 수정할 게시물 ID
 * MESSAGE = 수정할 게시물 내용
 *
 * [DELETE_POST]
 * POST_ID = 삭제할 게시물 ID
 **/
export default defineComponent({
  name: "Mattermost",
  setup() {
    return {
      rules: {
        required,
      },
      commonStore: useCommonStore(),
      commonDialog: useCommonDialog(),
      commonStore: useCommonStore(),
    }
  },
  data() {
    return {
      isValid: false,
      post: {
        id: "",
        channelId: "",
        message: ""
      },
      responseStr: "",
    }
  },
  computed: {},
  mounted() {
    this.commonStore.setBreadCrumbs(["Open API 예제", "Mattermost"]);
  },
  methods: {
    async getPost() {
      if (await this.hasWrongInput()) return;
      const response = await getPost(this.post.id);
      this.responseStr = JSON.stringify(response, null, 2);
    },
    async createPost() {
      const response = await createPost(this.post);
      this.responseStr = JSON.stringify(response, null, 2);
    },
    async putPost() {
      if (await this.hasWrongInput()) return;
      const response = await putPost(this.post);
      this.responseStr = JSON.stringify(response, null, 2);
    },
    async deletePost() {
      if (await this.hasWrongInput()) return;
      const response = await deletePost(this.post.id);
      this.responseStr = JSON.stringify(response, null, 2);
    },
    async hasWrongInput() {
      if (!this.isValid) {
        await this.commonDialog.showCommonDialog({
          title: 'Invalid',
          message: '입력값을 확인해주세요.',
          type: 'warn',
        });
        return true;
      }
    }
  }
});
</script>


<style scoped>
input {
  outline-color: black;
}
</style>

