<template>
  <div>
    <v-card flat>
      <v-card-text>
        <div class="search-item-wrap">
          <v-text-field
              v-model="keyword"
              clearable
              hide-details
              label="Keyword"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              width="500"
              @focusout="search"
              @keydown.enter="search"
              @click:prepend-inner="search"
              @click:clear="search"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="outlined" @click="write">등록</v-btn>
        </div>
        <v-table class="list-table">
          <colgroup>
            <col style="width: 20px">
            <col/>
            <col style="width: 150px">
            <col style="width: 150px">
          </colgroup>
          <thead>
          <tr>
            <th class="text-center" scope="col">No.</th>
            <th scope="col">Title</th>
            <th class="text-center" scope="col">수정자</th>
            <th class="text-center" scope="col">수정일</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(board, index) in boardList" :key="index">
            <td class="text-center">{{ (searchData.page - 1) * searchData.size + index + 1 }}</td>
            <td><a @click="goView(board.boardId)">{{ board.title }}</a></td>
            <td class="text-center">{{ board.modUser?.name ?? '-' }}</td>
            <td class="text-center">{{ time(board.modDatetime) }}</td>
          </tr>
          <tr v-if="boardList?.length === 0">
            <td class="text-center" colspan="4">
              검색된 내역이 없습니다.
            </td>
          </tr>
          </tbody>
        </v-table>
        <Pagination v-model:page="searchData.page"
                    v-model:size="searchData.size"
                    :total-pages="totalPages"/>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {useCommonStore} from "@/store/common.ts";
import Pagination from "@/components/common/Pagination.vue";
import {BoardSummaryForList, getBoardPage} from "@/api/board/BoardApi.ts";
import {time} from "@/util/TimeUtil.ts"

export default defineComponent({
  name: "NoticeList",
  components: {Pagination},
  setup() {
    let commonStore = useCommonStore();
    return {
      commonStore,
      time,
    }
  },
  mounted() {
    this.init();
    this.loadBoardList();
  },
  data() {
    return {
      bbsId: '',
      totalPages: 0,
      keyword: '',
      searchData: {
        size: 1,
        page: 1,
        keyword: '',
      },
      boardList: [] as BoardSummaryForList[],
    }
  },
  methods: {
    init() {
      this.bbsId = this.$route.params.bbsId as string;
      this.commonStore.setBreadCrumbs(["게시판 관리", this.getBoardTitle(this.bbsId)]);
      
      const query = this.$route.query;
      this.searchData.keyword = String(query.keyword ?? '');
      this.keyword = this.searchData.keyword;
      
      this.searchData.size = Number(query.size ?? 10);
      this.searchData.page = Number(query.page ?? 1);
    },
    search() {
      this.searchData.keyword = this.keyword;
      this.searchData.page = 1;
    },
    pushQuery() {
      this.$router.push({query: this.searchData});
    },
    async loadBoardList() {
      const params = {...this.searchData};
      params.page -= 1;
      let result = await getBoardPage(this.bbsId, params);
      if (result) {
        this.totalPages = result.page.totalPages;
        this.boardList = result.content;
      }
    },
    write() {
      this.$router.push({
            path: `/admin/board/${this.bbsId}/write`,
            query: {
              prevQuery: JSON.stringify(this.$route.query),
            }
          }
      )
    },
    goView(boardId: string) {
      this.$router.push({
            path: `/admin/board/${this.bbsId}/view/${boardId}`,
            query: {
              prevQuery: JSON.stringify(this.$route.query),
            }
          }
      )
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
  },
  watch: {
    searchData: {
      deep: true,
      handler() {
        this.pushQuery();
      }
    },
    $route() {
      this.init();
      this.loadBoardList();
    }
  }
})
</script>
