<template>
  <v-navigation-drawer expand-on-hover rail v-model:rail="isRail" @update:rail="toggleGroups"
                       mobile-breakpoint="0" elevation="2">
    <v-list class="user-info">
      <v-list-item :prepend-avatar="user['prepend-avatar']">
        <v-list-item-title>{{ user.title }}</v-list-item-title>
        <v-tooltip :text="user.subtitle" location="bottom">
          <template v-slot:activator="{ props }">
            <v-list-item-subtitle v-bind="props">{{ user.subtitle }}</v-list-item-subtitle>
          </template>
        </v-tooltip>
      </v-list-item>
      <div class="user-info-btn">
        <v-btn class="user-info-btn-account" size="x-small">로그아웃</v-btn>
        <v-btn class="user-info-btn-account" size="x-small">종료</v-btn>
      </div>
    </v-list>

    <v-divider></v-divider>

    <v-list v-model:opened="openedGroups" @update:opened="updateOpened"
            open-strategy="multiple">
      <div v-for="(menu, index) in menus" :key="index">
        <v-list-group v-if="menu.submenus" :value="menu.title">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="{...props, ...menu}"
              color="success"
              :active="menu.active"
            ></v-list-item>
          </template>
          <div v-for="(submenu, index) in menu.submenus" :key="index">
            <v-list-item v-bind="submenu" :active="submenu.active"
                         color="success"></v-list-item>
          </div>
        </v-list-group>
        <v-list-item v-else v-bind="menu" :active="menu.active"
                     color="success"></v-list-item>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>
<script setup>
import {onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router";

const route = useRoute();

const isRail = ref(true);

const previousOpenedGroups = ref([]);
const openedGroups = ref([]);

const user = ref({
  title: 'Username',
  subtitle: 'abcdefghijk@domain.com',
  'prepend-avatar': 'https://randomuser.me/api/portraits/women/85.jpg',
});

const menus = ref([
  {
    value: 'Home',
    title: 'Home',
    'prepend-icon': 'mdi-home',
    to: '/home',
    active: false,
    submenus: null,
  },
  {
    value: 'Containment',
    title: 'Containment',
    'prepend-icon': 'mdi-format-list-bulleted',
    active: false,
    submenus: [
      {
        value: 'Button',
        title: 'Button',
        'prepend-icon': 'mdi-information-box',
        to: '/containment/button',
        active: false,
      },
      {
        value: 'Card',
        title: 'Card',
        'prepend-icon': 'mdi-information-box',
        to: '/containment/card',
        active: false,
      },
      {
        value: 'List',
        title: 'List',
        'prepend-icon': 'mdi-information-box',
        to: '/containment/List',
        active: false,
      },
    ],
  },
  {
    value: 'Navigation',
    title: 'Navigation',
    'prepend-icon': 'mdi-format-list-bulleted',
    active: false,
    submenus: [
      {
        value: 'BreadCrumb',
        title: 'BreadCrumb',
        'prepend-icon': 'mdi-information-box',
        to: '/navigation/bread-crumb',
        active: false,
      },
      {
        value: 'Pagination',
        title: 'Pagination',
        'prepend-icon': 'mdi-information-box',
        to: '/navigation/pagination',
        active: false,
      },
    ],
  },
  {
    value: 'Control',
    title: 'Control',
    'prepend-icon': 'mdi-format-list-bulleted',
    active: false,
    submenus: [
      {
        value: 'CheckBox',
        title: 'CheckBox',
        'prepend-icon': 'mdi-information-box',
        to: '/control/check-box',
        active: false,
      },
      {
        value: 'ComboBox',
        title: 'ComboBox',
        'prepend-icon': 'mdi-information-box',
        to: '/control/combo-box',
        active: false,
      },
      {
        value: 'TextField',
        title: 'TextField',
        'prepend-icon': 'mdi-information-box',
        to: '/control/text-field',
        active: false,
      },
    ],
  },
  {
    value: 'Data',
    title: 'Data',
    'prepend-icon': 'mdi-format-list-bulleted',
    active: false,
    submenus: [
      {
        value: 'Data Table',
        title: 'Data Table',
        'prepend-icon': 'mdi-information-box',
        to: '/data/data-table',
        active: false,
      },
    ],
  },
  {
    value: 'VUETIFY Docs',
    title: 'VUETIFY Docs',
    'prepend-icon': 'mdi-file-document',
    href: 'https://vuetifyjs.com/en/getting-started/installation/#installation',
    target: '_blank',
    active: false,
    submenus: null,
  },
  {
    value: 'VUETIFY Github',
    title: 'VUETIFY Github',
    'prepend-icon': 'mdi-github',
    href: 'https://github.com/vuetifyjs/vuetify',
    target: '_blank',
    active: false,
    submenus: null,
  },
]);

const closeGroups = () => {
  previousOpenedGroups.value = openedGroups.value;
  openedGroups.value = [];
}

const openGroups = () => openedGroups.value = previousOpenedGroups.value;

const toggleGroups = () => {
  if (isRail.value) {
    closeGroups();
  } else {
    openGroups();
  }
};

const updateOpened = () => {
  if (isRail.value) {
    openedGroups.value = [...openedGroups.value, ...previousOpenedGroups.value];
    closeGroups();
  }
}

const isActive = (menu) => route.path.startsWith(menu.to);
const hasActive = (menu) => menu.submenus.some(submenu => submenu.active);
const activateMenu = () => {
  menus.value.forEach(menu => {
    if (menu.submenus) {
      menu.submenus.forEach(submenu => submenu.active = isActive(submenu));
      menu.active = hasActive(menu);
    } else {
      menu.active = isActive(menu);
    }
  })
};

onMounted(() => activateMenu());
watch(route, () => activateMenu());

</script>
<style lang="scss">
$navigation-drawer-width-rail: 56px;

.v-navigation-drawer {
  &--rail {
    + .layout-content-wrapper {
      padding-inline-start: $navigation-drawer-width-rail;
    }

    .user-info-btn-account {
      display: none;
    }
  }

  &--is-hovering {
    .user-info-btn-account {
      display: inline-grid;
      margin: 5px 5px 0 0;
    }
  }

  .user-info {
    display: flex;
    flex-direction: column;

    &-btn {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
