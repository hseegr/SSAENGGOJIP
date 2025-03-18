<template>
  <v-card flat>
    <v-card-text>
      <div class="search-item-wrap">
        <v-date-input v-model="fromDate" label="시작일자" prepend-icon=""
                      prepend-inner-icon="$calendar" variant="solo" hide-details min-width="180px"
                      :max="toDate"
                      @update:model-value="search"></v-date-input>
        <v-date-input v-model="toDate" label="종료일자" prepend-icon=""
                      prepend-inner-icon="$calendar" variant="solo" hide-details min-width="180px"
                      :min="fromDate"
                      @update:model-value="search"></v-date-input>
        <v-text-field
            v-model="keyword"
            clearable
            hide-details
            label="Keyword"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            min-width="300"
            @focusout="search"
            @keydown.enter="search"
            @click:prepend-inner="search"
            @click:clear="search"
        ></v-text-field>
      </div>
      <div class="mt-3">
        총 <strong>{{ totalCount }}</strong> 건
      </div>
      <v-table class="list-table">
        <colgroup>
          <col style="width: 80px">
          <col style="width: 80px">
          <col/>
          <col style="width: 200px">
          <col style="width: 200px">
        </colgroup>
        <thead>
        <tr>
          <th class="text-center" scope="col">No.</th>
          <th class="text-center" scope="col">ID</th>
          <th class="text-center" scope="col">메세지</th>
          <th class="text-center" scope="col">사용자</th>
          <th class="text-center" scope="col">등록일</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(error, index) in errorList" :key="index">
          <td class="text-center">{{ (searchData.page - 1) * searchData.size + index + 1 }}</td>
          <td class="text-center">{{ error.errorId }}</td>
          <td><a @click="goView(error.errorId)">{{ error.message }}</a></td>
          <td class="text-center">{{ error.regUser?.name ? error.regUser?.name : '-' }}</td>
          <td class="text-center">{{ time(error.regDatetime) }}</td>
        </tr>
        <tr v-if="errorList?.length === 0">
          <td class="text-center" colspan="5">
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
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Pagination from "@/components/common/Pagination.vue";
import {useCommonStore} from "@/store/common.ts";
import {time} from "@/util/TimeUtil.ts";
import {ErrorSummary, getErrorList} from "@/api/system/error/ErrorApi.ts";
import {format} from "date-fns";

const dateFormat = 'yyyy-MM-dd';
export default defineComponent({
  name: "ErrorList",
  components: {Pagination},
  setup() {
    return {
      commonStore: useCommonStore(),
      time,
    }
  },
  data() {
    return {
      totalPages: 0,
      totalCount: 0,
      keyword: '',
      fromDate: new Date(),
      toDate: new Date(),
      searchData: {
        size: 10,
        page: 1,
        keyword: '',
        fromDate: '',
        toDate: '',
      },
      errorList: [] as ErrorSummary[],
    }
  },
  mounted() {
    this.commonStore.setBreadCrumbs(["시스템 관리", "시스템 에러"]);
    this.init();
    this.loadErrorList();
  },
  methods: {
    init() {
      const query = this.$route.query;
      this.searchData.keyword = String(query.keyword ?? '');
      this.keyword = this.searchData.keyword;
      if (query.fromDate) {
        this.searchData.fromDate = String(query.fromDate ?? '');
        this.fromDate = new Date(this.searchData.fromDate);
      } else {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        this.searchData.fromDate = format(date, dateFormat);
        this.fromDate = new Date(date);
      }
      this.searchData.toDate = query.toDate ? String(query.toDate) : format(new Date(), dateFormat);
      this.toDate = new Date(this.searchData.toDate);

      this.searchData.size = Number(query.size ?? 10);
      this.searchData.page = Number(query.page ?? 1);
    },
    search() {
      this.searchData.page = 1;
      this.searchData.keyword = this.keyword;
      this.searchData.fromDate = format(this.fromDate, dateFormat);
      this.searchData.toDate = format(this.toDate, dateFormat);
    },
    pushQuery() {
      this.$router.push({query: this.searchData});
    },
    goView(errorId: string) {
      this.$router.push({
        path: `/admin/system/error/view/${errorId}`,
        query: {
          prevQuery: JSON.stringify(this.$route.query),
        }
      })
    },
    async loadErrorList() {
      let fromDate = new Date(this.searchData.fromDate);
      fromDate.setHours(0, 0, 0);
      let toDate = new Date(this.searchData.toDate);
      toDate.setHours(23, 59, 59);

      const params = {...this.searchData};
      params.page -= 1;
      params.fromDate = fromDate.toISOString();
      params.toDate = toDate.toISOString();

      let result = await getErrorList(params);
      if (result) {
        this.totalPages = result.page.totalPages;
        this.totalCount = result.page.totalElements;
        this.errorList = result.content;
      }
    },
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
      this.loadErrorList();
    }
  }
})
</script>