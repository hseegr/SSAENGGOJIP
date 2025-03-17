<template>
  <CodeUsage :component="component"></CodeUsage>
  <PropsTable :items="items"></PropsTable>
  <CardSection :sections="sections"></CardSection>
</template>
<script setup>
import CardSection from "@/components/CardSection.vue";
import CodeUsage from "@/components/CodeUsage.vue";
import {VBreadcrumbs} from "vuetify/components";
import {ref, shallowRef} from "vue";
import PropsTable from "@/components/PropsTable.vue";

const component = ref({
  tag: {
    object: shallowRef(VBreadcrumbs),
    name: 'v-breadcrumbs',
    text: '',
    value: {
      items: ['Foo', 'Bar', 'Fizz'],
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
    name: 'Divider',
    describe: 'Breadcrumbs separator can be set using divider property.',
  },
]);


const sections = ref([
  {
    id: 'breadcrumb',
    title: 'Guide',
    subtitle: 'Vuetify에서 제공하는 가이드 문서를 확인하려면 아래 링크를 클릭하세요.',
    cards: [
      {
        md: 4,
        appendIcon: 'mdi-open-in-new',
        class: 'mx-auto',
        to: '',
        href: 'https://vuetifyjs.com/en/components/breadcrumbs/#guide',
        prependIcon: 'mdi-file-search-outline',
        title: 'BreadCrumbs',
        subtitle: 'Check out the BreadCrumbs',
        src: ''
      },
    ]
  },
]);
</script>
