<template>
  
  <v-form v-model="isValid" fast-fail @submit.prevent>
    <v-container v-if="!isLoading" class="d-flex flex-column ga-3">
      <v-text-field
          v-model="board.title"
          :rules="[rules.required]"
          label="Title"
          variant="outlined"
      />
      <v-textarea
          v-model="board.content"
          :rules="[rules.required]"
          auto-grow
          counter
          label="Content"
          variant="outlined"
      />
      <v-file-input
          v-model="files"
          counter
          label="New Attachments"
          multiple
          prepend-icon=""
          show-size
          variant="outlined"
      >
      </v-file-input>
      <v-card v-if="isEditMode"
              prepend-icon="mdi-attachment"
              title="Original Attachments"
              variant="outlined">
        <template v-slot:append>
          <v-btn
              prepend-icon="mdi-download"
              size="small"
              @click="downloadAllFiles"
          >Download All
          </v-btn>
        </template>
        <v-list v-if="originalBoard">
          <v-list-item v-for="file in originalBoard.attachmentFiles"
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
            <template v-slot:append>
              <v-btn class="mr-5"
                     icon="mdi-trash-can-outline"
                     size="small"
                     variant="flat"
                     @click="deleteFile(file)"
              ></v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
      <v-row class="ga-2 ma-0 justify-end ">
        <v-btn @click="isEditMode ? moveToView() : moveToList()">취소</v-btn>
        <v-spacer/>
        <v-btn color="primary" type="submit" @click="save">저장</v-btn>
      </v-row>
    </v-container>
  </v-form>

</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {required} from "@/util/validationUtil.ts";
import {useCommonStore} from "@/store/common.ts";
import {
  AttachmentFileSummary,
  downloadAttachmentFile,
  uploadAttachmentFile
} from "@/api/attachment/AttachmentFileApi.ts";
import {BoardRequest, BoardSummary, getBoard, saveBoard, updateBoard} from "@/api/board/BoardApi.ts";
import {useCommonDialog} from "@/store/commonDialog.ts";
import {copyFields, getRouteParam, parseQueryValue} from "@/util/commonUtil.ts";
import {fileSize} from "@/util/fileUtil.ts";

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
      board: {
        title: '',
        content: '',
        upperBoardId: '',
        attachmentFileIds: <string[]>[],
      } satisfies BoardRequest,
      originalBoard: <BoardSummary | undefined>undefined,
    }
  },
  computed: {
    isEditMode() {
      return !!this.boardId;
    }
  },
  mounted() {
    this.bbsId = getRouteParam(this.$route.params.bbsId);
    this.boardId = getRouteParam(this.$route.params.boardId);
    if (this.isEditMode) {
      this.commonStore.setBreadCrumbs(["게시판 관리", `${this.getBoardTitle(this.bbsId)} 수정`]);
      this.loadBoard();
    } else {
      this.commonStore.setBreadCrumbs(["게시판 관리", `${this.getBoardTitle(this.bbsId)} 등록`]);
      this.isLoading = false;
    }
  },
  methods: {
    async loadBoard() {
      if (this.bbsId && this.boardId) {
        const result = await getBoard(this.bbsId, this.boardId);
        if (result) {
          this.originalBoard = result;
          copyFields(this.board, this.originalBoard);
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
      if (this.originalBoard) {
        for (const file of this.originalBoard.attachmentFiles) {
          await this.downloadFile(file);
        }
      }
    },
    deleteFile(file: AttachmentFileSummary) {
      if (this.originalBoard) {
        let index = this.originalBoard.attachmentFiles.indexOf(file);
        this.originalBoard.attachmentFiles.splice(index, 1);
      }
    },
    async save() {
      if (!this.bbsId) {
        return;
      }
      if (!this.isValid) {
        await this.commonDialog.showCommonDialog({
          title: 'Invalid',
          message: '입력값을 확인해주세요.',
          type: 'warn',
        });
        return;
      }
      if (this.originalBoard) {
        this.board.attachmentFileIds = [...this.originalBoard.attachmentFiles.map(value => value.fileId)];
      } else {
        this.board.attachmentFileIds = [];
      }
      
      for (const file of this.files) {
        let result = await uploadAttachmentFile(file, this.bbsId);
        if (result) {
          this.board.attachmentFileIds.push(result.fileId);
        }
      }
      let result
      if (this.isEditMode && this.boardId) {
        result = await updateBoard(this.bbsId, this.boardId, this.board);
      } else {
        result = await saveBoard(this.bbsId, this.board);
      }
      if (result?.success) {
        await this.commonDialog.showCommonDialog({
          title: 'Save',
          message: `글 ${this.isEditMode ? '수정' : '등록'}이 완료되었습니다.`,
          type: 'success',
        });
        
        if (this.isEditMode) {
          this.moveToView();
        } else {
          this.moveToList();
        }
      }
    },
    moveToView() {
      this.$router.push({
        path: `/admin/board/${this.bbsId}/view/${this.boardId}`,
        query: this.$route.query,
      });
    },
    moveToList() {
      this.$router.push({
        path: `/admin/board/${this.bbsId}`,
        query: parseQueryValue(this.$route.query.returnQuery),
      });
    },
    getBoardTitle(bbsId: string | undefined) {
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
