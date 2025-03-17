<template>
  <CodeUsage :component="component"></CodeUsage>
  <PropsTable :items="items"></PropsTable>
  <CardSection :sections="sections"></CardSection>
</template>
<script setup>
import CardSection from "@/components/CardSection.vue";
import CodeUsage from "@/components/CodeUsage.vue";
import {VTextField} from "vuetify/components";
import {ref, shallowRef} from "vue";
import PropsTable from "@/components/PropsTable.vue";

const component = ref({
  tag: {
    object: shallowRef(VTextField),
    name: 'v-text-field',
    text: '',
    value: {
      label: 'Label',
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
      title: 'Prepend Icon',
      value: {
        'prepend-icon': "$vuetify",
      },
    },
    {
      title: 'Clearable',
      value: {
        clearable: true,
      },
    }
  ],
});

const items = ref([
  {
    name: 'Labeling',
    describe: 'The label prop displays custom text for identifying an input’s purpose.',
  },
  {
    name: 'Placeholders',
    describe: 'Sometimes a label alone doesn’t convey enough information and you need to expose more.',
  },
  {
    name: 'Hint & Messages',
    describe: 'The label and placeholder props are useful for providing context to the input but are typically concise.',
  },
  {
    name: 'Clearable',
    describe: 'The clearable prop appends an inner v-icon that clears the v-text-field when clicked. ',
  },
  {
    name: 'Validation & Rules',
    describe: 'When working with inputs you often need to validate the user’s input in some manner; i.e. Email, Password.',
  },
  {
    name: 'Forms',
    describe: 'Group multiple v-text-field components and other functionality within a v-form component; for a more detailed look at forms, please visit the v-form page.',
  },
]);


const sections = ref([
  {
    id: 'text-field',
    title: 'Guide',
    subtitle: 'Vuetify에서 제공하는 가이드 문서를 확인하려면 아래 링크를 클릭하세요.',
    cards: [
      {
        md: 4,
        appendIcon: 'mdi-open-in-new',
        class: 'mx-auto',
        to: '',
        href: 'https://vuetifyjs.com/en/components/text-fields/#guide',
        prependIcon: 'mdi-file-search-outline',
        title: 'TextFields',
        subtitle: 'Check out the TestFields',
        src: ''
      },
    ]
  },
]);
</script>
