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
          <v-btn color="delete" variant="outlined" @click="deleteIpAllowlists">선택 항목 삭제</v-btn>
          <v-btn color="primary" variant="outlined" @click="writeIpAllowlist">등록</v-btn>
        </div>
        <v-table class="list-table">
          <colgroup>
            <col style="width: 50px">
            <col style="width: 20px">
            <col style="width: 200px">
            <col/>
            <col style="width: 150px">
            <col style="width: 150px">
          </colgroup>
          <thead>
          <tr>
            <th scope="col"></th>
            <th class="text-center" scope="col">No.</th>
            <th scope="col">IP</th>
            <th scope="col">설명</th>
            <th class="text-center" scope="col">수정자</th>
            <th class="text-center" scope="col">수정일</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(ipAllowlist, index) in ipAllowlists" :key="index">
            <td>
              <v-checkbox v-model="selectedIpAddrList" :value="ipAllowlist.ipAddr" hide-details></v-checkbox>
            </td>
            <td class="text-center">{{ (searchData.page - 1) * searchData.size + index + 1 }}</td>
            <td><a @click="writeIpAllowlist(ipAllowlist)">{{ ipAllowlist.ipAddr }}</a></td>
            <td>{{ ipAllowlist.description }}</td>
            <td class="text-center">{{ ipAllowlist.modUser?.name ?? '-' }}</td>
            <td class="text-center">{{ time(ipAllowlist.modDatetime) }}</td>
          </tr>
          <tr v-if="ipAllowlists?.length === 0">
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
    <ip-allowlist-write v-model:show="showDialog" :ip="editIp" @update:show="reload"/>
  </div>

</template>
<script lang="ts">
import {defineComponent} from "vue";
import {useCommonStore} from "@/store/common.ts";
import {time} from "@/util/TimeUtil.ts";
import {
  deleteIpAllowlists,
  getIpAllowlistPage,
  IpAllowlistRequest,
  IpAllowlistSummary
} from "@/api/system/ip-allowlist/IpAllowlistApi.ts";
import Pagination from "@/components/common/Pagination.vue";
import {useCommonDialog} from "@/store/commonDialog.ts";
import IpAllowlistWrite from "@/view/admin/system/ip-allowlist/IpAllowlistWrite.vue";

export default defineComponent({
  name: "IpAllowlist",
  components: {IpAllowlistWrite, Pagination},
  setup() {
    return {
      commonStore: useCommonStore(),
      commonDialog: useCommonDialog(),
      time,
    }
  },
  data() {
    return {
      totalPages: 0,
      totalCount: 0,
      selectedIpAddrList: [],
      keyword: '',
      searchData: {
        size: 10,
        page: 1,
        keyword: '',
      },
      ipAllowlists: [] as IpAllowlistSummary[],
      showDialog: false,
      editIp: {} as IpAllowlistRequest,
    }
  },
  mounted() {
    this.commonStore.setBreadCrumbs(["시스템 관리", "허용 IP"])
    this.init();
    this.loadIpAllowlist();
  },
  methods: {
    init() {
      const query = this.$route.query;
      this.searchData.size = Number(query.size ?? 10);
      this.searchData.page = Number(query.page ?? 1);
      this.searchData.keyword = String(query.keyword ?? '');
      this.keyword = this.searchData.keyword;
      this.selectedIpAddrList = [];
    },
    async loadIpAllowlist() {
      const params = {...this.searchData};
      params.page -= 1;
      let result = await getIpAllowlistPage(params);
      if (result) {
        this.totalPages = result.page.totalPages;
        this.totalCount = result.page.totalElements;
        this.ipAllowlists = result.content;
      }
    },
    search() {
      this.searchData.keyword = this.keyword;
      this.searchData.page = 1;
    },
    pushQuery() {
      this.$router.push({query: {...this.searchData}});
    },
    async deleteIpAllowlists() {
      if (this.selectedIpAddrList.length === 0) {
        await this.commonDialog.showCommonDialog({
          title: 'Check',
          message: '삭제할 항목을 선택하세요.',
          type: 'info',
        })
        return;
      }
      
      if (!await this.commonDialog.showCommonDialog({
        title: 'Delete',
        message: '삭제하시겠습니까?',
        type: 'info',
        useCancel: true,
      })) return;
      
      let params = new URLSearchParams();
      this.selectedIpAddrList.forEach((ip) => params.append("ips", ip));
      let result = await deleteIpAllowlists(params);
      if (result?.success) {
        await this.commonDialog.showCommonDialog({
          title: 'Delete',
          message: `IP 삭제가 완료되었습니다.`,
          type: 'success',
        });
        this.reload();
      } else if (result?.success === false) {
        await this.commonDialog.showCommonDialog({
          title: "Delete Error",
          message: result?.message ?? '삭제 중에 에러가 발생하였습니다.',
          type: 'error',
        });
      }
    },
    writeIpAllowlist(ip: IpAllowlistSummary) {
      if (ip) {
        this.editIp = ip;
      } else {
        this.editIp.ipAddr = '';
        this.editIp.description = '';
      }
      this.showDialog = true;
    },
    reload() {
      this.init();
      this.loadIpAllowlist();
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
      this.reload();
    }
  },
})
</script>
