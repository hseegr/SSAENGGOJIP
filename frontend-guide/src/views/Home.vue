<template>
  <CardSection :sections="sections"></CardSection>
</template>
<script setup>
import CardSection from "@/components/CardSection.vue";
import {ref} from "vue";

const sections = ref([
  {
    id: 'component',
    title: 'Component',
    subtitle: 'Vuetify에서 제공하는 Component입니다. 모든 Component를 확인하려면 아래 링크를 클릭하세요.',
    cards: [
      {
        md: 4,
        appendIcon: 'mdi-open-in-new',
        class: 'mx-auto',
        to: '',
        href: 'https://vuetifyjs.com/en/components/all/#containment',
        prependIcon: 'mdi-vuetify',
        title: 'Vuetify Components',
        subtitle: 'Check out the Vuetify Components',
        src: ''
      }
    ]
  },
  {
    id: 'containment',
    title: 'Containment',
    subtitle: 'Containment는 다른 구성요소를 포함하는 기능을 제공합니다. 일반적으로 일관된 레이아웃 또는 스타일을 제공하는 데 사용됩니다.',
    cards: [
      {
        appendIcon: 'mdi-open-in-new',
        class: 'mx-auto',
        to: '/containment/button',
        href: '',
        prependIcon: '',
        title: 'Button',
        subtitle: '',
        src: 'https://cdn.vuetifyjs.com/docs/images/preview/buttons.png'
      },
      {
        appendIcon: 'mdi-open-in-new',
        class: 'mx-auto',
        to: '/containment/card',
        href: '',
        prependIcon: '',
        title: 'Card',
        subtitle: '',
        src: 'https://cdn.vuetifyjs.com/docs/images/preview/cards.png'
      },
      {
        appendIcon: 'mdi-open-in-new',
        class: 'mx-auto',
        to: '/containment/list',
        href: '',
        prependIcon: '',
        title: 'List',
        subtitle: '',
        src: 'https://cdn.vuetifyjs.com/docs/images/preview/lists.png'
      }
    ]
  },
  {
    id: 'navigation',
    title: 'Navigation',
    subtitle: 'Navigation은 서로 다른 페이지 사이를 탐색하는 데 사용됩니다.',
    cards: [
      {
        appendIcon: 'mdi-open-in-new',
        class: 'mx-auto',
        to: '/navigation/bread-crumb',
        href: '',
        prependIcon: '',
        title: 'BreadCrumb',
        subtitle: '',
        src: 'https://cdn.vuetifyjs.com/docs/images/preview/breadcrumbs.png'
      },
      {
        appendIcon: 'mdi-open-in-new',
        class: 'mx-auto',
        to: '/navigation/pagination',
        href: '',
        prependIcon: '',
        title: 'Pagination',
        subtitle: '',
        src: 'https://cdn.vuetifyjs.com/docs/images/preview/paginations.png'
      }
    ]
  },
  {
    id: 'control',
    title: 'Control',
    subtitle: 'Control은 다양한 방법으로 사용자 입력을 수집하는 데 사용됩니다.',
    cards: [
      {
        appendIcon: 'mdi-open-in-new',
        class: 'mx-auto',
        to: '/control/check-box',
        href: '',
        prependIcon: '',
        title: 'CheckBox',
        subtitle: '',
        src: 'https://cdn.vuetifyjs.com/docs/images/preview/checkboxes.png'
      },
      {
        appendIcon: 'mdi-open-in-new',
        class: 'mx-auto',
        to: '/control/combo-box',
        href: '',
        prependIcon: '',
        title: 'ComboBox',
        subtitle: '',
        src: 'https://cdn.vuetifyjs.com/docs/images/preview/comboboxes.png'
      },
      {
        appendIcon: 'mdi-open-in-new',
        class: 'mx-auto',
        to: '/control/text-field',
        href: '',
        prependIcon: '',
        title: 'TextField',
        subtitle: '',
        src: 'https://cdn.vuetifyjs.com/docs/images/preview/text-fields.png'
      }
    ]
  },
  {
    id: 'data',
    title: 'Data',
    subtitle: 'Data는 다양한 방법으로 데이터와 정보를 표시하는 데 사용됩니다.',
    cards: [
      {
        appendIcon: 'mdi-open-in-new',
        class: 'mx-auto',
        to: '/data/data-table',
        href: '',
        prependIcon: '',
        title: 'DataTable',
        subtitle: '',
        src: 'https://cdn.vuetifyjs.com/docs/images/preview/paginations.png'
      }
    ]
  }

]);
</script>
