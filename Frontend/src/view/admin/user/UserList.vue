<template>
  <div>
    <v-card flat>
      <v-card-text>
        <div class="search-item-wrap">
          <v-select
              v-model="searchData.regionCd"
              :items="regionListWithAll"
              hide-details
              item-title="title"
              item-value="code"
              label="Region"
              variant="outlined"
              width="200"
              @update:model-value="search"
          >
          </v-select>
          <v-select
              v-model="searchData.roleId"
              :items="roleListWithAll"
              hide-details
              item-title="description"
              item-value="roleId"
              label="Role"
              variant="outlined"
              width="200"
              @update:model-value="search"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item :subtitle="item.raw.roleId" v-bind="props"></v-list-item>
            </template>
          </v-select>
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
          <v-btn color="primary" variant="outlined" @click="addUser">등록</v-btn>
        </div>
        <v-table class="list-table">
          <thead>
          <tr>
            <th scope="col">No.</th>
            <th scope="col">User Id</th>
            <th scope="col">Email</th>
            <th scope="col">이름</th>
            <th scope="col">권한</th>
            <th scope="col">지역</th>
            <th class="text-center" scope="col">상태</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(user, index) in userList" :key="user.userId">
            <td>{{ (searchData.page - 1) * searchData.size + index + 1 }}</td>
            <td><a @click="openUserDialog(user)">{{ user.userId }}</a></td>
            <td>{{ user.loginId }}</td>
            <td>{{ user.name }}</td>
            <td>
              <v-chip v-for="role in user.roles" :key="role.roleId"
                      class="mr-1" color="primary"
              >
                {{ role.description }}
              </v-chip>
            </td>
            <td>{{ user.region ? user.region.title : '-' }}</td>
            <td class="text-center">
              <v-chip v-if="user.disabledYn === 'Y'" color="red">
                DISABLED
              </v-chip>
              <v-chip v-else color="green">
                ACTIVE
              </v-chip>
            </td>
          </tr>
          <tr v-if="userList?.length === 0">
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
    <user-edit-dialog v-model:show="showEditDialog"
                      :mode="selectedUser ? 'edit' : 'new'"
                      :refresh="loadUserList"
                      :region-list="regionList"
                      :role-list="roleList"
                      :user="selectedUser"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import {getUserPage, UserSummary} from "@/api/user/UserApi.ts";
import {CommonCodeSummary, getCommonCodeList} from "@/api/commoncode/CommonCodeApi.ts";
import Pagination from "@/components/common/Pagination.vue";
import {useCommonStore} from "@/store/common.ts";
import UserEditDialog from "@/view/admin/user/component/UserEditDialog.vue";
import {getRoleSimpleList, RoleSummarySimple} from "@/api/commoncode/RoleApi.ts";
import VCommonDialog from "@/components/common/CommonDialog.vue";
import {mapActions} from "pinia";
import {useCommonDialog} from "@/store/commonDialog.ts";

export default defineComponent({
  name: 'userList',
  components: {VCommonDialog, UserEditDialog, Pagination},
  data() {
    return {
      showEditDialog: false,
      selectedUser: <UserSummary | undefined>undefined,
      keyword: '',
      totalPages: 0,
      regionList: [] as CommonCodeSummary[],
      roleList: [] as RoleSummarySimple[],
      searchData: {
        size: 1,
        page: 1,
        keyword: '',
        regionCd: '',
        roleId: '',
      },
      userList: new Array<UserSummary>,
    }
  },
  computed: {
    regionListWithAll() {
      return [{code: '', title: '전체', index: 0, option: ''}, ...this.regionList];
    },
    roleListWithAll() {
      return [{roleId: '', description: '전체'}, ...this.roleList];
    }
  },
  setup() {
    const dialog = ref<InstanceType<typeof VCommonDialog> | null>(null);
    return {
      dialog,
    }
  },
  mounted() {
    useCommonStore().setBreadCrumbs(["사용자 관리", "사용자"]);
    this.init();
    this.loadCommonCodes();
    this.loadRoleList();
    this.loadUserList();
  },
  methods: {
    ...mapActions(useCommonDialog, ['showCommonDialog']),
    init() {
      const query = this.$route.query;
      this.searchData.regionCd = String(query.regionCd ?? '');
      this.searchData.roleId = String(query.roleId ?? '');
      
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
    async loadCommonCodes() {
      let regionList = await getCommonCodeList("region");
      if (regionList) {
        this.regionList = regionList;
      }
    },
    async loadRoleList() {
      let roleList = await getRoleSimpleList();
      if (roleList) {
        this.roleList = roleList;
      }
    },
    async loadUserList() {
      const params = {...this.searchData};
      params.page -= 1;
      let userPage = await getUserPage(params);
      if (userPage) {
        this.totalPages = userPage.page.totalPages;
        this.userList = userPage.content;
      }
    },
    openUserDialog(user: UserSummary) {
      this.selectedUser = user;
      this.showEditDialog = true;
    },
    async addUser() {
      this.selectedUser = null;
      this.showEditDialog = true;
      
      
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
      this.loadUserList();
    }
  }
})

</script>
