<template>
  <CodeUsage :component="component">
    <v-data-table :headers="exampleHeaders" :items="exampleItems"></v-data-table>
  </CodeUsage>
  <PropsTable :items="items"></PropsTable>
  <CardSection :sections="sections"></CardSection>
</template>
<script setup>
import CardSection from "@/components/CardSection.vue";
import CodeUsage from "@/components/CodeUsage.vue";
import {VDataTable} from "vuetify/components";
import {ref} from "vue";
import PropsTable from "@/components/PropsTable.vue";

const exampleHeaders = ref([
  {
    align: 'start',
    key: 'name',
    sortable: false,
    title: 'Dessert (100g serving)',
  },
  {key: 'calories', title: 'Calories'},
  {key: 'fat', title: 'Fat (g)'},
  {key: 'carbs', title: 'Carbs (g)'},
  {key: 'protein', title: 'Protein (g)'},
  {key: 'iron', title: 'Iron (%)'},
]);

const exampleItems = ref([
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    iron: 1,
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    iron: 1,
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    iron: 7,
  },
]);

const component = ref({
  tag: {
    object: 'Div',
    name: 'v-data-table',
    text: '',
    value: {
      ':headers': 'headers',
      ':items': 'items',
    },
  },
  toolbarItems: [
    {
      title: 'Default',
      value: null,
    },
  ],
  checkboxItems: null,
});

const items = ref([
  {
    name: 'Density',
    describe: 'Using the density prop you are able to give your data tables an alternate style.',
  },
  {
    name: 'Hide Default Header and Footer',
    describe: 'You can apply the hide-default-header and hide-default-footer props to remove the default header and footer respectively.',
  },
  {
    name: 'Selection',
    describe: 'The show-select prop will render a checkbox in the default header to toggle all rows, and a checkbox for each row.',
  },
  {
    name: 'Simple Checkbox',
    describe: 'When wanting to use a checkbox component inside of a slot template in your data tables, use the v-checkbox-btn component rather than the v-checkbox component. The v-checkbox-btn component is used internally and will respect header alignment.',
  },
]);

const sections = ref([
  {
    id: 'datatables',
    title: 'Guide',
    subtitle: 'Vuetify에서 제공하는 가이드 문서를 확인하려면 아래 링크를 클릭하세요.',
    cards: [
      {
        md: 4,
        appendIcon: 'mdi-open-in-new',
        class: 'mx-auto',
        to: '',
        href: 'https://vuetifyjs.com/en/components/data-tables/#guide',
        prependIcon: 'mdi-file-search-outline',
        title: 'DataTables',
        subtitle: 'Check out the DataTables',
        src: ''
      },
    ]
  },
]);
</script>
