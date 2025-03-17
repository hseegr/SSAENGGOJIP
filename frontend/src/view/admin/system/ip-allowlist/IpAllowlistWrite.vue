<template>
  
  <v-dialog v-model="showDialog" persistent width="500">
    <v-card :title="isEditMode?'허용 IP 수정':'허용 IP 추가'" prepend-icon="mdi-shield-home">
      <v-form v-model="isValid" @submit.prevent>
        <v-container class="d-flex flex-column ga-3">
          <v-text-field
              v-model="ipAllowlist.ipAddr"
              :readonly="isEditMode"
              :rules="[rules.required, rules.validateIpAddress]"
              clearable
              label="허용 IP"
              variant="outlined"
          />
          <v-text-field
              v-model="ipAllowlist.description"
              :rules="[rules.required]"
              clearable
              label="설명"
              variant="outlined"
          />
          <v-card-actions>
            <v-spacer/>
            <v-btn @click="close">취소</v-btn>
            <v-btn color="primary" variant="tonal" @click="save">저장</v-btn>
          </v-card-actions>
        </v-container>
      </v-form>
    </v-card>
  </v-dialog>

</template>

<script lang="ts" setup>
import {
  IpAllowlistRequest,
  IpAllowlistSummary,
  saveIpAllowlist,
  updateIpAllowlist
} from "@/api/system/ip-allowlist/IpAllowlistApi.ts";
import {computed, ref, watch} from "vue";
import {useCommonDialog} from "@/store/commonDialog.ts";
import {required} from "@/util/validationUtil.ts";

const validateIpAddress = (value: string) => {
  const pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return pattern.test(value) || '입력한 IP가 유효하지 않습니다.'
}

const commonDialog = useCommonDialog();
const rules = {required, validateIpAddress};

const props = defineProps<{
  show: boolean,
  ip: IpAllowlistSummary,
}>();
const emit = defineEmits(['update:show']);

const isEditMode = computed(() => !!props.ip.ipAddr);
const showDialog = computed({
  get: () => props.show,
  set: (value) => {
    emit('update:show', value);
  },
});

const isValid = ref(false);
const ipAllowlist = ref<IpAllowlistRequest>({ipAddr: '', description: ''});
const reset = () => {
  ipAllowlist.value.ipAddr = String(props.ip.ipAddr ?? '');
  ipAllowlist.value.description = String(props.ip.description ?? '');
};
const close = () => {
  showDialog.value = false;
};
const save = async () => {
  if (!isValid.value) {
    await commonDialog.showCommonDialog({
      title: 'Invalid',
      message: '입력값을 확인해주세요.',
      type: 'warn',
    });
    return;
  }
  
  if (!await commonDialog.showCommonDialog({
    title: 'Save',
    message: '저장하시겠습니까?',
    type: 'info',
    useCancel: true,
  })) return;
  
  let result;
  if (isEditMode.value) {
    result = await updateIpAllowlist(ipAllowlist.value);
  } else {
    result = await saveIpAllowlist(ipAllowlist.value);
  }
  
  if (result?.success) {
    await commonDialog.showCommonDialog({
      title: 'Save',
      message: `IP ${isEditMode.value ? '수정' : '등록'}이 완료되었습니다.`,
      type: 'success',
    });
    close();
  } else {
    await commonDialog.showCommonDialog({
      title: "Save Error",
      message: result?.message ?? '저장 중에 에러가 발생하였습니다.',
      type: 'error',
    });
  }
};

watch(() => props.show, (newVal, oldVal) => {
  if (newVal && !oldVal) reset();
})
</script>
