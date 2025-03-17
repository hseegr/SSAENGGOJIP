<template>
  <CodeUsage :component="component">{{ component.tag.text }}</CodeUsage>
  <PropsTable :items="items"></PropsTable>
  <CardSection :sections="sections"></CardSection>
</template>
<script setup>
import CardSection from "@/components/CardSection.vue";
import CodeUsage from "@/components/CodeUsage.vue";
import {VBtn} from "vuetify/components";
import {ref, shallowRef} from "vue";
import PropsTable from "@/components/PropsTable.vue";

const component = ref({
  tag: {
    object: shallowRef(VBtn),
    name: 'v-btn',
    text: 'button',
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
      },
    },
    {
      title: 'Tonal',
      value: {
        variant: 'tonal',
      },
    },
    {
      title: 'Text',
      value: {
        variant: 'text',
      },
    },
    {
      title: 'Plain',
      value: {
        variant: 'plain',
      },
    },
  ],
  checkboxItems: [
    {
      title: 'Icon',
      value: {
        icon: '$vuetify',
      },
    },
    {
      title: 'Prepend Icon',
      value: {
        'prepend-icon': '$vuetify',
      },
    },
    {
      title: 'Append Icon',
      value: {
        'append-icon': '$vuetify',
      },
    },
  ],
});

const items = ref([
  {
    name: 'Density',
    describe: 'The density prop is used to control the vertical space that the button takes up.',
  },
  {
    name: 'Size',
    describe: 'The size property is used to control the size of the button and scales with density. The default size is undefined which essentially translates to medium.',
  },
  {
    name: 'Block',
    describe: 'Block buttons extend the full available width of their container. This is useful for creating buttons that span the full width of a card or dialog.',
  },
  {
    name: 'Rounded',
    describe: 'Use the rounded prop to control the border radius of a button.',
  },
  {
    name: 'Elevation',
    describe: 'The elevation property provides up to 24 levels of shadow depth. By default, buttons rest at 2dp.',
  },
  {
    name: 'Ripple',
    describe: 'The ripple property determines whether the v-ripple directive is used.',
  },
  {
    name: 'Variants',
    describe: 'The variant prop gives you easy access to several different button styles. Available variants are: elevated(default), flat, tonal, outlined, text, and plain.',
  },
  {
    name: 'Icon',
    describe: 'Icons can be used for the primary content of a button. They are commonly used in the v-toolbar and v-app-bar components.',
  },
  {
    name: 'Loaders',
    describe: 'Using the loading prop, you can notify a user that there is processing taking place. The default behavior is to use a v-progress-circular component but this can be customized with the loader slot.',
  },
  {
    name: 'Inside of bars',
    describe: 'A common use-case is to use the v-btn with the icon property within a v-toolbar or v-app-bar component.',
  },
]);

const sections = ref([
  {
    id: 'button',
    title: 'Guide',
    subtitle: 'Vuetify에서 제공하는 가이드 문서를 확인하려면 아래 링크를 클릭하세요.',
    cards: [
      {
        md: 4,
        appendIcon: 'mdi-open-in-new',
        class: 'mx-auto',
        to: '',
        href: 'https://vuetifyjs.com/en/components/buttons/#guide',
        prependIcon: 'mdi-file-search-outline',
        title: 'Buttons',
        subtitle: 'Check out the Buttons',
        src: ''
      },
    ]
  },
]);
</script>
