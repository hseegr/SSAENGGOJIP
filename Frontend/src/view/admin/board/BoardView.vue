<template>
  
  <v-container v-if="!isLoading && board" class="d-flex flex-column ga-3">
    <v-text-field
        v-model="board.title"
        label="Title"
        readonly
        variant="outlined"
    />
    <v-textarea
        v-model="board.content"
        auto-grow
        counter
        label="Content"
        readonly
        variant="outlined"
    />
    <v-card prepend-icon="mdi-attachment" title="Attachments" variant="outlined">
      <template v-slot:append>
        <v-btn
            prepend-icon="mdi-download"
            size="small"
            @click="downloadAllFiles"
        >Download All
        </v-btn>
      </template>
      <v-list :items="board.attachmentFiles">
        <v-list-item v-for="file in board.attachmentFiles"
                     :key="file.fileId"
                     :subtitle="fileSize(file.fileSize)"
                     :title="file.fileName"
        >
          <template v-slot:prepend>
            <v-btn class="mr-5"
                   icon="mdi-download"
                   size="small"
                   variant="flat"
                   @click="downloadFile(file)"
            ></v-btn>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
    <v-row class="ga-2 ma-0 justify-end ">
      <v-btn @click="moveToList">목록</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="delete" variant="outlined">글 삭제</v-btn>
      <v-btn color="primary" type="submit" @click="moveToModify">수정</v-btn>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {required} from "@/util/validationUtil.ts";
import {useCommonStore} from "@/store/common.ts";
import {AttachmentFileSummary, downloadAttachmentFile} from "@/api/attachment/AttachmentFileApi.ts";
import {BoardSummary, getBoard} from "@/api/board/BoardApi.ts";
import {useCommonDialog} from "@/store/commonDialog.ts";
import {fileSize} from "@/util/fileUtil.ts"
import {getRouteParam, parseQueryValue} from "@/util/commonUtil.ts";

export default defineComponent({
  name: "NoticeWrite",
  setup() {
    return {
      rules: {
        required,
      },
      fileSize,
      commonStore: useCommonStore(),
      commonDialog: useCommonDialog(),
    }
  },
  data() {
    return {
      isLoading: true,
      bbsId: <string | undefined>undefined,
      boardId: <string | undefined>undefined,
      isValid: false,
      files: <File[]>[],
      board: <BoardSummary | undefined>undefined
    }
  },
  mounted() {
    this.isLoading = true;
    this.bbsId = getRouteParam(this.$route.params.bbsId);
    this.boardId = getRouteParam(this.$route.params.boardId);
    this.commonStore.setBreadCrumbs(["게시판 관리", this.getBoardTitle(this.bbsId)])
    this.loadBoard();
  },
  methods: {
    async loadBoard() {
      if (this.bbsId && this.boardId) {
        const result = await getBoard(this.bbsId, this.boardId);
        if (result) {
          this.board = result;
          this.isLoading = false;
        }
      }
    },
    async downloadFile(file: AttachmentFileSummary) {
      try {
        await downloadAttachmentFile(file.fileId, file.fileType);
      } catch (err) {
        await this.commonDialog.showCommonDialog({
          title: 'Error',
          message: 'Fail to download',
          type: 'error',
        });
      }
    },
    async downloadAllFiles() {
      if (this.board) {
        for (const file of this.board.attachmentFiles) {
          await this.downloadFile(file);
        }
      }
    },
    moveToModify() {
      this.$router.push({
        path: `/admin/board/${this.bbsId}/write/${this.boardId}`,
        query: this.$route.query,
      });
    },
    moveToList() {
      this.$router.push({
        path: `/admin/board/${this.bbsId}`,
        query: parseQueryValue(this.$route.query.prevQuery),
      });
    },
    getBoardTitle(bbsId?: string) {
      switch (bbsId) {
        case 'notice':
          return '공지';
        case 'free':
          return '자유 게시판';
        default :
          return '게시판';
      }
    }
  }
})
</script>
