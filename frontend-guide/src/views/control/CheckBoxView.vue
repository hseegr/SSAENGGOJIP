<template>
  <CodeUsage :component="component"></CodeUsage>
  <PropsTable :items="items"></PropsTable>
  <CardSection :sections="sections"></CardSection>
</template>
<script setup>
import CardSection from "@/components/CardSection.vue";
import CodeUsage from "@/components/CodeUsage.vue";
import {VCheckbox} from "vuetify/components";
import {ref, shallowRef} from "vue";
import PropsTable from "@/components/PropsTable.vue";

const component = ref({
  tag: {
    object: shallowRef(VCheckbox),
    name: 'v-checkbox',
    text: '',
    value: {
      label: 'Checkbox',
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
    name: 'Colors',
    describe: 'Checkboxes can be colored by using any of the builtin colors and contextual names using the color prop.',
  },
  {
    name: 'Model as Array',
    describe: 'Multiple v-checkbox’s can share the same v-model by using an array.',
  },
  {
    name: 'Model as Boolean',
    describe: 'A single v-checkbox will have a boolean value as its value.',
  },
  {
    name: 'States',
    describe: 'v-checkbox can have different states such as default, disabled, and indeterminate.',
  },
]);


const sections = ref([
  {
    id: 'checkbox',
    title: 'Guide',
    subtitle: 'Vuetify에서 제공하는 가이드 문서를 확인하려면 아래 링크를 클릭하세요.',
    cards: [
      {
        md: 4,
        appendIcon: 'mdi-open-in-new',
        class: 'mx-auto',
        to: '',
        href: 'https://vuetifyjs.com/en/components/checkboxes/#guide',
        prependIcon: 'mdi-file-search-outline',
        title: 'CheckBoxes',
        subtitle: 'Check out the CheckBoxes',
        src: ''
      },
    ]
  },
]);
</script>
