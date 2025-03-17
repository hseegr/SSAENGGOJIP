<template>
  <CodeUsage :component="component"></CodeUsage>
  <PropsTable :items="items"></PropsTable>
  <CardSection :sections="sections"></CardSection>
</template>
<script setup>
import CardSection from "@/components/CardSection.vue";
import CodeUsage from "@/components/CodeUsage.vue";
import {VPagination} from "vuetify/components";
import {ref, shallowRef} from "vue";
import PropsTable from "@/components/PropsTable.vue";

const component = ref({
  tag: {
    object: shallowRef(VPagination),
    name: 'v-pagination',
    text: '',
    value: {
      length: 2,
    },
  },
  toolbarItems: [
    {
      title: 'Default',
      value: null,
    },
  ],
  checkboxItems: [
    {
      title: 'Length - small',
      value: {
        length: 2,
      },
    },
    {
      title: 'Length - medium',
      value: {
        length: 5,
      },
    },
    {
      title: 'Length - large',
      value: {
        length: 10,
      },
    },
  ],
});

const items = ref([
  {
    name: 'Rounded',
    describe: 'The rounded prop allows you to render pagination buttons with alternative styles.',
  },
  {
    name: 'Disabled',
    describe: 'Pagination items can be manually deactivated using the disabled prop.',
  },
  {
    name: 'Icons',
    describe: 'Previous and next page icons can be customized with the prev-icon and next-icon props.',
  },
  {
    name: 'Length',
    describe: 'Using the length prop you can set the length of v-pagination, if the number of page buttons exceeds the parent container, it will truncate the list.',
  },
  {
    name: 'Total Visible',
    describe: 'You can also manually set the maximum number of visible page buttons with the total-visible prop.',
  },
]);

const sections = ref([
  {
    id: 'pagination',
    title: 'Guide',
    subtitle: 'Vuetify에서 제공하는 가이드 문서를 확인하려면 아래 링크를 클릭하세요.',
    cards: [
      {
        md: 4,
        appendIcon: 'mdi-open-in-new',
        class: 'mx-auto',
        to: '',
        href: 'https://vuetifyjs.com/en/components/paginations/#guide',
        prependIcon: 'mdi-file-search-outline',
        title: 'Pagination',
        subtitle: 'Check out the Pagination',
        src: ''
      },
    ]
  },
]);
</script>
