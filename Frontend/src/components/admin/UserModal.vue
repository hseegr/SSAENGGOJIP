<template>
  <div class="pa-4 text-center">
    <v-dialog
        v-model="showModal"
        min-width="600"
        persistent
        width="1000"
    >
      <v-card prepend-icon="mdi-account">
        <template #title>
          <strong>사용자 추가</strong>
        </template>
        <v-container class="d-flex flex-column ga-2 pt-0">
          <v-row class="ga-3 ma-0 align-center">
            <span><strong>총 {{ totalCount }} 명</strong></span>
            <v-text-field
                v-model="keyword"
                clearable
                density="compact"
                hide-details
                label="교육생/이메일"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                @focusout="search"
                @keydown.enter="search"
                @click:prepend-inner="search"
                @click:clear="search"
            />
          </v-row>
          <v-table
              :hover="true"
              class="list-table"
              density="compact"
          >
            <colgroup>
              <col style="width:80px">
              <col style="width:100px">
              <col style="width:180px">
              <col style="width:660px">
            </colgroup>
            <thead>
            <tr>
              <th scope="col">
                <v-checkbox
                    v-model="checkedAll"
                    density="compact"
                    hide-details
                    @click="checkAll"
                />
              </th>
              <th scope="col">
                No.
              </th>
              <th scope="col">
                이름
              </th>
              <th scope="col">
                이메일
              </th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="(user, index) in userList"
                :key="user.userId"
                @click="checkUser(user, !user.checked)"
            >
              <td>
                <v-checkbox
                    v-model="user.checked"
                    :disabled="!user.selectable"
                    density="compact"
                    hide-details
                />
              </td>
              <td>{{ (searchData.page - 1) * searchData.size + index + 1 }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.loginId }}</td>
            </tr>
            <tr v-if="userList?.length === 0">
              <td
                  class="text-center"
                  colspan="4"
              >
                검색된 내역이 없습니다.
              </td>
            </tr>
            </tbody>
          </v-table>
          <Pagination
              v-model:page="searchData.page"
              v-model:size="searchData.size"
              :total-pages="totalPages"
          />
          <v-row class="ga-3 ma-0 align-center">
            <span><strong>총 {{ checkedUserMap.size }} 명</strong></span>
            <v-btn
                size="small"
                @click="removeCheckedUserMap()"
            >
              전체삭제
            </v-btn>
          </v-row>
          <v-container class="border-md">
            <v-chip
                v-for="user in checkedUserMap.values()"
                :key="user.userId"
                class="ma-1"
                closable
                color="secondary"
                @click:close="removeCheckedUserMap(user.userId)"
            >
              {{ user.name }}
            </v-chip>
          </v-container>
          <v-row class="ga-3 ma-0 align-center">
            <v-spacer/>
            <v-btn @click="close(false)">
              취소
            </v-btn>
            <v-btn @click="close(true)">
              확인
            </v-btn>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts" setup>

import {computed, ref, watch} from "vue";
import Pagination from "@/components/common/Pagination.vue";
import {getUserPage, UserSummary, UserSummarySimple} from "@/api/user/UserApi.ts";
import {copyFields} from "@/util/commonUtil.ts";

export interface UserSummaryInUserModal extends UserSummarySimple {
  selectable: boolean;
  checked: boolean;
}

const props = defineProps<{
  show: boolean,
  skipUserList?: UserSummaryInUserModal[];
}>();

const emit = defineEmits(['update:show', 'confirm']);

const showModal = computed({
  get: () => props.show,
  set: (value) => {
    emit('update:show', value);
  },
});

const totalPages = ref(0);
const totalCount = ref(0);
const keyword = ref('');
const defaultSearchData = {
  size: 10,
  page: 1,
  regionCd: '',
  keyword: '',
};
const searchData = ref({...defaultSearchData});
const userList = ref<UserSummaryInUserModal[]>(new Array<UserSummaryInUserModal>);
const checkedAll = ref(false);
const checkedUserMap = ref<Map<string, UserSummaryInUserModal>>(new Map<string, UserSummaryInUserModal>);

const checkUser = (user: UserSummaryInUserModal, value: boolean) => {
  if (!user.selectable || !user.userId) return;
  user.checked = value;
  if (user.checked) {
    checkedUserMap.value.set(user.userId, user);
  } else {
    checkedUserMap.value.delete(user.userId);
  }
};
const checkAll = () => {
  checkedAll.value = !checkedAll.value;
  userList.value?.forEach((user) => checkUser(user, checkedAll.value));
};
const removeCheckedUserMap = (userId?: string) => {
  if (userId) {
    const target = userList.value.find((user) => user.userId === userId);
    if (target) {
      checkUser(target, false);
    } else {
      checkedUserMap.value.delete(userId);
    }
  } else {
    checkedUserMap.value.clear();
    userList.value.forEach((user) => user.checked = false);
  }
};
const close = (isOk: boolean) => {
  if (isOk) {
    const checkedList = [];
    for (const value of checkedUserMap.value.values()) {
      checkedList.push(value);
    }
    emit('confirm', checkedList);
  }
  showModal.value = false;
};
const search = async () => {
  const params = {...searchData.value};
  params.keyword = keyword.value;
  params.page -= 1;
  const userPage = await getUserPage(params);
  if (userPage) {
    totalPages.value = userPage.page.totalPages;
    totalCount.value = userPage.page.totalElements;
    userList.value = userPage.content.map((user) => toUserSummaryInUserModal(user));
  }
};
const toUserSummaryInUserModal = (user: UserSummary) => {
  const userSummaryInUserModal: UserSummaryInUserModal = {
    userId: '',
    loginId: '',
    name: '',
    selectable: !props.skipUserList?.find((target) => target.userId === user.userId),
    checked: !!checkedUserMap.value.get(user.userId),
  };
  copyFields(userSummaryInUserModal, user);
  return userSummaryInUserModal;
};
const reset = () => {
  checkedUserMap.value.clear();
  keyword.value = '';
  searchData.value = {...defaultSearchData};
};

watch(() => props.show, (newVal, oldVal) => {
  if (newVal && !oldVal) reset();
});
watch(searchData, () => {
  search();
}, {deep: true});
watch(userList, () => {
  checkedAll.value = !(userList.value?.find((user) => !user.checked && user.selectable));
}, {deep: true});

</script>
