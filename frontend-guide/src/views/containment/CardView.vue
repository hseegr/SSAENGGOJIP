<template>
  <CodeUsage :component="component">{{ component.tag.text }}</CodeUsage>
  <PropsTable :items="items"></PropsTable>
  <CardSection :sections="sections"></CardSection>
</template>
<script setup>
import CardSection from "@/components/CardSection.vue";
import CodeUsage from "@/components/CodeUsage.vue";
import {VCard} from "vuetify/components";
import {ref, shallowRef} from "vue";
import PropsTable from "@/components/PropsTable.vue";

const component = ref({
  tag: {
    object: shallowRef(VCard),
    name: 'v-card',
    text: 'card example ...',
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
  ],
  checkboxItems: [
    {
      title: 'Show Title',
      value: {
        title: 'Card Title',
      },
    },
    {
      title: 'Show Subtitle',
      value: {
        subtitle: 'Subtitle',
      },
    },
    {
      title: 'Loading',
      value: {
        loading: true,
      },
    },
  ],
});

const items = ref([
  {
    name: 'Variant',
    describe: 'The variant prop gives you easy access to several different card styles. Available variants are: elevated(default), flat, tonal, outlined, text, and plain.',
  },
  {
    name: 'Color',
    describe: 'Cards can be colored by using any of the builtin colors and contextual names using the color prop.',
  },
  {
    name: 'Elevation',
    describe: 'The elevation property provides up to 24 levels of shadow depth. By default, cards rest at 2dp.',
  },
  {
    name: 'Hover',
    describe: 'When using the hover prop, the cards will increase its elevation when the mouse is hovered over them.',
  },
  {
    name: 'Href',
    describe: 'The card becomes an anchor with the href prop.',
  },
]);

const sections = ref([
  {
    id: 'card',
    title: 'Guide',
    subtitle: 'Vuetify에서 제공하는 가이드 문서를 확인하려면 아래 링크를 클릭하세요.',
    cards: [
      {
        md: 4,
        appendIcon: 'mdi-open-in-new',
        class: 'mx-auto',
        to: '',
        href: 'https://vuetifyjs.com/en/components/cards/#guide',
        prependIcon: 'mdi-file-search-outline',
        title: 'Cards',
        subtitle: 'Check out the Cards',
        src: ''
      },
    ]
  },
]);
</script>
