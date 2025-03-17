<script lang="ts" setup>

import {computed, reactive, ref, watch} from "vue";
import {CommonCodeSummary} from "@/api/commoncode/CommonCodeApi.ts";
import {saveUser, updateUser, UserRequest, UserSummary} from "@/api/user/UserApi.ts";
import {RoleSummarySimple} from "@/api/commoncode/RoleApi.ts";
import {copyFields} from "@/util/commonUtil.ts";
import {cloneDeep} from "lodash";
import {email, maxLen, required} from "@/util/validationUtil.ts";
import {useCommonDialog} from "@/store/commonDialog.ts";

let commonDialog = useCommonDialog();

const props = defineProps<{
  show: boolean,
  mode: 'new' | 'edit',
  regionList: CommonCodeSummary[],
  roleList: RoleSummarySimple[],
  user: UserSummary | undefined,
  refresh: Function,
}>();

const emit = defineEmits(['update:show']);

const localShow = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value),
});

const initialUser: UserRequest = {
  loginId: '',
  name: '',
  password: '',
  regionCd: '',
  disabledYn: 'N',
  roleIds: []
};

const localUser: UserRequest = reactive(cloneDeep(initialUser));

const userId = ref<string>('');

const isEditMode = computed<boolean>(() => props.mode === 'edit')

const isValid = ref<boolean>(false);

watch(() => props.show, (value) => {
  if (value) {
    userId.value = '';
    Object.assign(localUser, cloneDeep(initialUser));
    if (isEditMode.value) {
      userId.value = props.user?.userId ?? '';
      copyFields(
          localUser,
          {
            ...props.user,
            roleIds: props.user?.roles ? props.user?.roles?.map(role => role.roleId) : []
          }
      );
    }
  }
})

const rules = {
  email,
  required,
  maxLen: maxLen(20),
}

const passwordRules = [
  (value: string) => {
    if (isEditMode.value) {
      return true;
    } else {
      return rules.required(value);
    }
  }
]

const save = async () => {
  if (!isValid.value) {
    await commonDialog.showCommonDialog({
      title: "Invalid",
      message: "잘못된 입력값이 있습니다.",
      type: "warn",
    });
    return;
  }
  let res;
  if (isEditMode.value) {
    res = await updateUser(userId.value, localUser);
  } else {
    res = await saveUser(localUser);
    
  }
  if (res?.success) {
    await commonDialog.showCommonDialog({
      title: "Save",
      message: "저장이 완료되었습니다.",
      type: "success",
    });
    props.refresh();
    localShow.value = false;
  } else if (res?.success === false) {
    await commonDialog.showCommonDialog({
      title: "Save Error",
      message: res?.message ?? '저장중에 에러가 발생하였습니다.',
      type: 'error',
    });
  }
}


</script>

<template>
  <div class="pa-4 text-center">
    <v-dialog
        v-model="localShow"
        persistent
        width="600"
    >
      <v-card
          prepend-icon="mdi-account"
          title="User Profile"
      >
        <v-form v-model="isValid" fast-fail @submit.prevent>
          <v-container class="d-flex flex-column ga-1">
            
            <v-text-field
                v-if="isEditMode"
                v-model="userId"
                color="primary"
                label="User Id"
                readonly
                variant="underlined"
            ></v-text-field>
            <v-text-field
                v-model="localUser.loginId"
                :readonly="isEditMode"
                :rules="[rules.required, rules.email]"
                color="primary"
                label="Email"
                variant="underlined"
            ></v-text-field>
            
            <v-text-field
                v-model="localUser.password"
                :rules="passwordRules"
                color="primary"
                label="Password"
                type="password"
                variant="underlined"
            ></v-text-field>
            
            <v-text-field
                v-model="localUser.name"
                :rules="[rules.required, rules.maxLen]"
                color="primary"
                label="Name"
                variant="underlined"
            ></v-text-field>
            
            <v-select
                v-model="localUser.regionCd"
                :items="regionList"
                :rules="[rules.required]"
                item-title="title"
                item-value="code"
                label="Region"
                variant="underlined">
            
            </v-select>
            
            <v-select
                v-model="localUser.roleIds"
                :items="roleList"
                chips
                item-title="description"
                item-value="roleId"
                label="Roles"
                multiple
                variant="underlined"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item :subtitle="item.raw.roleId" v-bind="props"></v-list-item>
              </template>
            </v-select>
            
            <v-switch
                v-model="localUser.disabledYn"
                :label="`상태: ${localUser.disabledYn === 'Y' ? 'DISABLED' : 'ACTIVE'}`"
                base-color="red"
                color="green"
                false-value="Y"
                hide-details
                true-value="N"
            >
            </v-switch>
          
          </v-container>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            
            <v-btn
                @click="localShow = false"
            >취소
            </v-btn>
            
            <v-btn
                color="primary"
                type="submit"
                variant="tonal"
                @click="save"
            >저장
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>
