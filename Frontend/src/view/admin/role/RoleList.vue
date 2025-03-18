<template>
  
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
            width="300"
            @focusout="search"
            @keydown.enter="search"
            @click:prepend-inner="search"
            @click:clear="search"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="outlined" @click="goWrite">등록</v-btn>
      </div>
      <v-table class="list-table">
        <thead>
        <tr>
          <th class="text-center" scope="col">No.</th>
          <th scope="col">권한 ID</th>
          <th scope="col">설명</th>
          <th class="text-center" scope="col">사용자</th>
          <th class="text-center" scope="col">수정자</th>
          <th class="text-center" scope="col">수정일</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(role, index) in roleList" :key="role.roleId">
          <td class="text-center">{{ (searchData.page - 1) * searchData.size + index + 1 }}</td>
          <td><a @click="goView(role.roleId)">{{ role.roleId }}</a></td>
          <td><a @click="goView(role.roleId)">{{ role.description }}</a></td>
          <td class="text-center">{{ role.userCount }}</td>
          <td class="text-center">{{ role.modUser?.name }}</td>
          <td class="text-center">{{ time(role.modDatetime) }}</td>
        </tr>
        <tr v-if="roleList?.length === 0">
          <td class="text-center" colspan="6">
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
import {defineComponent} from 'vue'
import {useCommonStore} from "@/store/common.ts";
import {getRolePage, RoleSummaryForList} from "@/api/commoncode/RoleApi.ts";
import Pagination from "@/components/common/Pagination.vue";
import {time} from "@/util/TimeUtil.ts";

export default defineComponent({
  name: "RoleList",
  components: {Pagination},
  data() {
    return {
      keyword: '',
      totalPages: 0,
      searchData: {
        size: 10,
        page: 1,
        keyword: '',
      },
      roleList: <RoleSummaryForList[]>[],
    }
  },
  setup() {
    let commonStore = useCommonStore();
    return {
      commonStore,
      time,
    }
  },
  mounted() {
    this.commonStore.setBreadCrumbs(["사용자 관리", "권한"]);
    this.init();
    this.loadRoleList();
  },
  methods: {
    time,
    init() {
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
    async loadRoleList() {
      const params = {...this.searchData};
      params.page -= 1;
      let rolePage = await getRolePage(params);
      if (rolePage) {
        this.totalPages = rolePage.page.totalPages;
        this.roleList = rolePage.content;
      }
    },
    goWrite() {
      this.$router.push({
        path: '/admin/role/view/',
        query: {
          prevQuery: JSON.stringify(this.$route.query),
        }
      })
    },
    goView(roleId: String) {
      this.$router.push({
        path: `/admin/role/view/${roleId}`,
        query: {
          prevQuery: JSON.stringify(this.$route.query),
        }
      })
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
      this.loadRoleList();
    }
  }
})
</script>

