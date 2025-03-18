<template>
  <v-form
      v-model="isValid"
      @submit.prevent
  >
    <v-container
        v-if="!isLoading"
        class="d-flex flex-column ga-3"
    >
      <span><strong>권한 정보</strong></span>
      <v-spacer/>
      <v-text-field
          v-model="roleDetail.roleId"
          :readonly="isEditMode"
          :rules="[rules.required, rules.minLen(6), rules.maxLen(35), rules.startWithROLE, rules.upperWithUnderscore]"
          label="권한 ID"
          variant="outlined"
      />
      <v-text-field
          v-model="roleDetail.description"
          :rules="[rules.required, rules.maxLen(100)]"
          label="설명"
          variant="outlined"
      />
      <v-outline title="사용자 목록">
        <v-container>
          <v-row class="ga-3 ma-0 align-center">
            <v-spacer/>
            <span><strong> {{ selectedUsers.length }} 명 선택 / 총 {{ roleDetail.users.length }} 명</strong></span>
            <v-btn
                color="delete"
                size="small"
                variant="outlined"
                @click="removeUser"
            >
              선택한 사용자 삭제
            </v-btn>
            <v-btn
                color="primary"
                size="small"
                variant="outlined"
                @click="showUserModal"
            >
              사용자 추가
            </v-btn>
          </v-row>
          <v-data-table-virtual
              v-model="selectedUsers"
              :fixed-header="true"
              :headers="headers"
              :hover="true"
              :items="roleDetail.users"
              :row-props="rowProps"
              :show-select="true"
              class="mt-3"
              height="500px"
              item-selectable="selectable"
              item-value="userId"
              @click:row="handleRowClick"
          >
            <template #item.index="{ index }">
              {{ index + 1 }}
            </template>
            <template #no-data>
              <span>사용자가 없습니다.</span>
            </template>
          </v-data-table-virtual>
        </v-container>
      </v-outline>
      <v-row class="ga-3 ma-0 align-center">
        <v-btn @click="goList">
          취소
        </v-btn>
        <v-spacer/>
        <v-btn
            v-if="isEditMode"
            color="delete"
            variant="outlined"
            @click="deleteRole"
        >
          권한 {{ roleId }} 삭제
        </v-btn>
        <v-btn color="primary" @click="saveRole">
          저장
        </v-btn>
      </v-row>
    </v-container>
    <user-modal
        v-model:show="showModal"
        :skip-user-list="roleDetail.users"
        @confirm="addUsers"
    />
  </v-form>
</template>
<script lang="ts">
import {defineComponent} from "vue";
import {useCommonStore} from "@/store/common.ts";
import {time} from "@/util/TimeUtil.ts";
import {maxLen, minLen, required} from "@/util/validationUtil.ts";
import {deleteRole, getRoleSummary, RoleRequest, RoleSummary, saveRole,} from "@/api/commoncode/RoleApi.ts";
import {useUserStore} from "@/store/user.ts";
import {useCommonDialog} from "@/store/commonDialog.ts"
import UserModal, {UserSummaryInUserModal} from "@/components/admin/UserModal.vue";
import {copyFields} from "@/util/commonUtil.ts";
import VOutline from "@/components/common/VOutline.vue";

const startWithROLE = (value: string) => value.startsWith('ROLE_') || '"ROLE_"로 시작해야 합니다.';
const upperWithUnderscore = (value: string) => {
  const pattern = /^[A-Z_]+$/;
  return pattern.test(value) || '영문 대문자와 _ 만 사용 가능합니다.';
}

interface UserSummaryInRole extends UserSummaryInUserModal {
  added: boolean;
}

interface RoleSummaryInRole extends RoleSummary {
  users: UserSummaryInRole[];
}

export default defineComponent({
  name: 'RoleView',
  components: {VOutline, UserModal},
  setup() {
    return {
      rules: {
        required,
        maxLen,
        minLen,
        startWithROLE,
        upperWithUnderscore,
      },
      userStore: useUserStore(),
      commonStore: useCommonStore(),
      commonDialog: useCommonDialog(),
      time,
    }
  },
  data() {
    return {
      isLoading: true,
      isValid: false,
      roleId: '',
      keyword: '',
      roleDetail: {
        roleId: '',
        description: '',
        modDatetime: '',
        modUser: undefined,
        users: <UserSummaryInRole[]>[]
      } satisfies RoleSummaryInRole,
      showModal: false,
      selectedUsers: new Array<string>,
      headers: [
        {title: 'No.', value: 'index', width: 120},
        {title: '이름', value: 'name', width: 200},
        {title: '이메일', value: 'loginId'},
      ],
    }
  },
  computed: {
    isEditMode() {
      return !!this.roleId;
    },
  },
  mounted() {
    this.roleId = this.$route.params.roleId as string;
    if (this.isEditMode) {
      this.commonStore.setBreadCrumbs(["사용자 관리", "권한 수정"]);
      this.loadRoleDetail();
    } else {
      this.commonStore.setBreadCrumbs(["사용자 관리", "권한 등록"]);
      this.isLoading = false;
    }
  },
  methods: {
    isAdmin() {
      return this.roleId === 'ROLE_ADMIN';
    },
    async loadRoleDetail() {
      const result = await getRoleSummary(this.roleId);
      if (result) {
        copyFields(this.roleDetail, result);
        this.roleDetail.users?.forEach((user) => {
          user.selectable = !((user.loginId === this.userStore.userInfo?.loginId) && this.isAdmin());
          user.added = false;
          user.checked = false;
        });
        this.isLoading = false;
      }
    },
    goList() {
      this.$router.push({
        path: '/admin/role',
        query: JSON.parse(String(this.$route.query.prevQuery)),
      });
    },
    handleRowClick(_event: unknown, {item}: { item: UserSummaryInRole }) {
      if (!item.selectable) return;
      const targetIndex = this.selectedUsers.indexOf(item.userId);
      if (targetIndex > -1) {
        this.selectedUsers.splice(targetIndex, 1);
      } else {
        this.selectedUsers.push(item.userId);
      }
    },
    async removeUser() {
      if (this.selectedUsers.length === 0) {
        await this.commonDialog.showCommonDialog({
          title: 'Check',
          message: '삭제할 항목을 선택하세요.',
          type: 'info',
        });
        return;
      }
      
      this.selectedUsers.forEach((userId) => {
        const targetIndex = this.roleDetail.users.findIndex(user => user.userId === userId);
        if (targetIndex > -1) {
          this.roleDetail.users.splice(targetIndex, 1);
        }
      });
      this.selectedUsers = [];
    },
    addUsers(users: UserSummaryInUserModal[]) {
      users.forEach((user) => {
        const target: UserSummaryInRole = {
          userId: '',
          loginId: '',
          name: '',
          selectable: true,
          checked: false,
          added: true,
        };
        copyFields(target, user);
        target.selectable = true;
        this.roleDetail.users?.unshift(target);
      });
    },
    showUserModal() {
      this.showModal = true;
    },
    async saveRole() {
      if (!this.isValid) {
        await this.commonDialog.showCommonDialog({
          title: 'Invalid',
          message: '입력값을 확인해주세요.',
          type: 'warn',
        });
        return;
      }
      
      const isOk = await this.commonDialog.showCommonDialog({
        title: 'Save',
        message: '저장하시겠습니까?',
        type: 'info',
        useCancel: true,
      });
      if (!isOk) return;
      
      const body: RoleRequest = {
        description: this.roleDetail.description,
        userIdList: this.roleDetail.users.map(user => user.userId)
      };
      
      const result = await saveRole(this.roleDetail.roleId, body);
      if (result?.success) {
        await this.commonDialog.showCommonDialog({
          title: 'Save',
          message: `권한 ${this.isEditMode ? '수정' : '등록'}이 완료되었습니다.`,
          type: 'success',
        });
        this.goList();
      } else if (result?.success === false) {
        await this.commonDialog.showCommonDialog({
          title: "Save Error",
          message: result?.message ?? '저장 중에 에러가 발생하였습니다.',
          type: 'error',
        });
      }
    },
    async deleteRole() {
      const isOk = await this.commonDialog.showCommonDialog({
        title: 'Delete',
        message: '삭제하시겠습니까?',
        type: 'info',
        useCancel: true,
      });
      if (!isOk) return;
      
      const result = await deleteRole(this.roleId);
      if (result?.success) {
        await this.commonDialog.showCommonDialog({
          title: 'Delete',
          message: `권한 삭제가 완료되었습니다.`,
          type: 'success',
        });
        this.goList();
      } else if (result?.success === false) {
        await this.commonDialog.showCommonDialog({
          title: "Delete Error",
          message: result?.message ?? '삭제 중에 에러가 발생하였습니다.',
          type: 'error',
        });
      }
    },
    rowProps(data: Record<string, UserSummaryInRole>) {
      return {
        class: {
          'added': data.item.added,
        },
        style: data.item.added ? {'background': 'aliceblue'} : {},
      };
    }
  },
})
</script>
