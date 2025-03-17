<template>
  <h2>Props</h2>
  <div class="props-table">
    <v-data-table
      :headers="headers"
      :items="items"
      hide-default-footer
    ></v-data-table>
  </div>
</template>
<script setup>
import {ref} from "vue";

const headers = ref([
  {
    align: 'start',
    key: 'name',
    sortable: false,
    title: 'Props',
  },
  {
    key: 'describe',
    title: 'Describe',
  },
]);

const props = defineProps({
  items: {
    Type: Object,
    required: true,
  }
})
</script>
<style lang="scss">
.props-table {
  margin-bottom: 40px;
}
</style>
