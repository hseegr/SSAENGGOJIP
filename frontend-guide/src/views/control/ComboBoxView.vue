<template>
  <CodeUsage :component="component"></CodeUsage>
  <PropsTable :items="items"></PropsTable>
  <CardSection :sections="sections"></CardSection>
</template>
<script setup>
import CardSection from "@/components/CardSection.vue";
import CodeUsage from "@/components/CodeUsage.vue";
import {VCombobox} from "vuetify/components";
import {ref, shallowRef} from "vue";
import PropsTable from "@/components/PropsTable.vue";

const component = ref({
  tag: {
    object: shallowRef(VCombobox),
    name: 'v-combobox',
    text: '',
    value: {
      label: 'Combobox',
      'items': ['California', 'Colorado', 'Florida', 'Georgia', 'Texas'],
    },
  },
  toolbarItems: [
    {
      title: 'Default',
      value: null,
    },
    {
      title: 'Outlined',
      value: {
        variant: 'outlined',
      }
    },
    {
      title: 'Underlined',
      value: {
        variant: 'underlined',
      }
    },
    {
      title: 'Solo',
      value: {
        variant: 'solo',
      }
    },
    {
      title: 'Solo-filled',
      value: {
        variant: 'solo-filled',
      }
    },
    {
      title: 'Solo-inverted',
      value: {
        variant: 'solo-inverted',
      }
    },
  ],
  checkboxItems: [
    {
      title: 'Clearable',
      value: {
        clearable: true,
      },
    },
    {
      title: 'Chips',
      value: {
        chips: true,
      },
    },
    {
      title: 'Multiple',
      value: {
        multiple: true,
      },
    }
  ],
});

const items = ref([
  {
    name: 'Density',
    describe: 'You can use density prop to adjust vertical spacing within the component.',
  },
  {
    name: 'Multiple Combobox',
    describe: 'Previously known as tags - user is allowed to enter more than one value.',
  },
]);


const sections = ref([
  {
    id: 'combobox',
    title: 'Guide',
    subtitle: 'Vuetify에서 제공하는 가이드 문서를 확인하려면 아래 링크를 클릭하세요.',
    cards: [
      {
        md: 4,
        appendIcon: 'mdi-open-in-new',
        class: 'mx-auto',
        to: '',
        href: 'https://vuetifyjs.com/en/components/combobox/#guide',
        prependIcon: 'mdi-file-search-outline',
        title: 'ComboBox',
        subtitle: 'Check out the ComboBox',
        src: ''
      },
    ]
  },
]);
</script>
