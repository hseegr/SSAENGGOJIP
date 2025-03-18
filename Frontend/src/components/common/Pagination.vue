<script lang="ts" setup>
import {computed, ref, watch} from "vue";

interface PaginationProps {
  page: number;
  size: number;
  totalPages: number;
}

const props = defineProps<PaginationProps>();
const emit = defineEmits(['update:page', 'update:size']);

const localPage = ref(props.page);
const localSize = ref(props.size);
const totalPages = computed(() => props.totalPages);

const updatePage = (newPage: number) => emit('update:page', newPage)
const updateSize = (newSize: number) => {
  emit('update:page', 1);
  emit('update:size', newSize);
}

watch(() => props.page, (newPage) => localPage.value = newPage)
watch(() => props.size, (newSize) => localSize.value = newSize)

</script>

<template>
  <div class="pagination-wrap">
    <v-select v-model="localSize"
              :items="[10, 20, 30, 50, 100]"
              class="page-size"
              density="compact"
              hide-details
              label="Size"
              variant="outlined"
              @update:model-value="updateSize"/>
    <v-pagination v-model="localPage"
                  :length="totalPages"
                  total-visible="10"
                  @update:model-value="updatePage"
    />
    <v-spacer class="page-size"/>
  </div>
</template>

<style lang="scss" scoped>
.pagination-wrap {
  display: flex;
  align-items: end;
  
  .page-size {
    width: 100px;
    flex: unset;
    flex-shrink: 0;
  }
  
  .v-pagination {
    flex: 1;
  }
}
</style>
