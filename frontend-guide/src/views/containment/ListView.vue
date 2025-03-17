<template>
  <CodeUsage :component="component">
    <v-list-item
      v-for="n in 3"
      :key="n"
      :title="'Item ' + n"
      :subtitle="'Example' + n"
    ></v-list-item>
  </CodeUsage>
  <PropsTable :items="items"></PropsTable>
  <CardSection :sections="sections"></CardSection>
</template>
<script setup>
import CardSection from "@/components/CardSection.vue";
import CodeUsage from "@/components/CodeUsage.vue";
import {VList, VListItem} from "vuetify/components";
import {ref, shallowRef} from "vue";
import PropsTable from "@/components/PropsTable.vue";

const component = ref({
  tag: {
    object: shallowRef(VList),
    name: 'v-list',
    text: '<v-list-item\n' +
      '      v-for="n in 3"\n' +
      '      :key="n"\n' +
      '      :title="\'Item \' + n"\n' +
      '      :subtitle="\'Example\' + n"\n' +
      '    ></v-list-item>',
    value: {
      lines: 'one',
    },
  },
  toolbarItems: [
    {
      title: 'Default',
      value: null,
    },
    {
      title: 'Two-lines',
      value: {
        lines: 'two',
      },
    },
    {
      title: 'Three-lines',
      value: {
        lines: 'three',
      },
    },
  ],
  checkboxItems: null,
});

const items = ref([
  {
    name: 'Items',
    describe: 'Lists can either be created by markup using the many sub-components that are available, or by using the items prop.',
  },
  {
    name: 'Density',
    describe: 'v-list supports the density property.',
  },
  {
    name: 'Disabled',
    describe: 'You cannot interact with disabled v-list.',
  },
  {
    name: 'Variant',
    describe: 'v-list supports the variant prop.',
  },
  {
    name: 'Nav',
    describe: 'Lists can receive an alternative nav styling that reduces the width v-list-item takes up as well as adding a border radius.',
  },
]);

const sections = ref([
  {
    id: 'list',
    title: 'Guide',
    subtitle: 'Vuetify에서 제공하는 가이드 문서를 확인하려면 아래 링크를 클릭하세요.',
    cards: [
      {
        md: 4,
        appendIcon: 'mdi-open-in-new',
        class: 'mx-auto',
        to: '',
        href: 'https://vuetifyjs.com/en/components/lists/#guide',
        prependIcon: 'mdi-file-search-outline',
        title: 'Lists',
        subtitle: 'Check out the Lists',
        src: ''
      },
    ]
  },
]);
</script>
