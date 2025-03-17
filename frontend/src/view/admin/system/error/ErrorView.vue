<template>
  <v-container v-if="!isLoading" class="d-flex flex-column ga-3">
    <span>
      <strong>ERROR 정보</strong>
    </span>
    <v-spacer></v-spacer>
    <v-text-field
        :model-value="error.errorId"
        hide-details
        label="ERROR ID"
        readonly
        variant="outlined"
    />
    <v-textarea
        :model-value="error.message"
        auto-grow
        hide-details
        label="Message"
        readonly
        variant="outlined"
    />
    <v-text-field
        :model-value="error.regUser?.name ? error.regUser?.name : '-'"
        hide-details
        label="사용자"
        readonly
        variant="outlined"
    />
    <v-text-field
        :model-value="format(error.regDatetime, 'yyyy-MM-dd')"
        hide-details
        label="등록일"
        readonly
        variant="outlined"
    />
    <v-textarea
        :model-value="error.stacktrace"
        hide-details
        label="STACKTRACE"
        no-resize
        readonly
        rows="15"
        variant="outlined"
    />
    <div class="mt-3">
      <v-btn @click="goList">목록</v-btn>
    </div>
  </v-container>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {useCommonStore} from "@/store/common.ts";
import {ErrorDetail, getError} from "@/api/system/error/ErrorApi.ts";
import {UserSummarySimple} from "@/api/user/UserApi.ts";
import {time} from "@/util/TimeUtil.ts";
import {format} from "date-fns";

export default defineComponent({
  name: "ErrorView",
  setup() {
    return {
      commonStore: useCommonStore(),
      time,
    }
  },
  data() {
    return {
      isLoading: true,
      errorId: '',
      error: {
        errorId: '',
        message: '',
        stacktrace: '',
        regUser: {} as UserSummarySimple,
        regDatetime: '',
      } as ErrorDetail
    }
  },
  mounted() {
    this.commonStore.setBreadCrumbs(["시스템 관리", "시스템 에러"]);
    this.init();
    this.loadErrorDetail();
  },
  methods: {
    format,
    init() {
      this.isLoading = true;
      this.errorId = this.$route.params.errorId as string;
    },
    async loadErrorDetail() {
      let result = await getError(this.errorId);
      if (result) {
        this.error = result;
        this.isLoading = false;
      }
    },
    goList() {
      this.$router.push({
        path: '/admin/system/error',
        query: JSON.parse(String(this.$route.query.prevQuery)),
      });
    },
  },
})
</script>
