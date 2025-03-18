<script lang="ts" setup>
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useUserStore} from "@/store/user.ts";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const isRail = ref(true);

const previousOpenedGroups = ref([]);
const openedGroups = ref([]);

interface Menu {
  value: string,
  title: string,
  icon?: string,
  to?: string,
  active: boolean,
  submenus?: Menu[],
}

const menus = ref<Menu[]>([
  {
    value: 'Home',
    title: 'Home',
    icon: 'mdi-home',
    to: '/admin/home',
    active: false,
  },
  {
    value: 'systemManagement',
    title: '시스템 관리',
    icon: 'mdi-cog',
    active: false,
    submenus: [
      {
        value: 'error',
        title: '시스템 에러',
        icon: 'mdi-alert',
        to: '/admin/system/error',
        active: false,
      },
      {
        value: 'ip-allowlist',
        title: '허용 IP',
        icon: 'mdi-shield-home',
        to: '/admin/system/ip-allowlist',
        active: false,
      },
    ],
  },
  {
    value: 'userManagement',
    title: '사용자 관리',
    icon: 'mdi-account',
    active: false,
    submenus: [
      {
        value: 'user',
        title: '사용자',
        icon: 'mdi-account',
        to: '/admin/user',
        active: false,
      },
      {
        value: 'role',
        title: '권한',
        icon: 'mdi-shield-account',
        to: '/admin/role',
        active: false,
      },
    ],
  },
  {
    value: 'boardManagement',
    title: '게시판 관리',
    icon: 'mdi-bulletin-board',
    active: false,
    submenus: [
      {
        value: 'notice',
        title: '공지',
        icon: 'mdi-alert-circle',
        to: '/admin/board/notice',
        active: false,
      },
      {
        value: 'freeBoard',
        title: '자유 게시판',
        icon: 'mdi-comment-text-outline',
        to: '/admin/board/free',
        active: false,
      },
    ],
  },
  {
    value: 'apiExample',
    title: 'Open API 예제',
    icon: 'mdi-code-array',
    active: false,
    submenus: [
      {
        value: 'mattermost',
        title: 'Mattermost',
        icon: 'mdi-api',
        to: '/admin/example/mattermost',
        active: false,
      },
    ],
  }
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

const isActive = (menu: Menu) => menu.to ? route.path.startsWith(menu.to) : false;
const hasActive = (menu: Menu) => menu.submenus?.some(submenu => submenu.active) ?? false;
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

const logout = () => {
  userStore.logout();
  router.go(0);
}

onMounted(() => activateMenu());
watch(route, () => activateMenu());
</script>

<template>
  <v-navigation-drawer
    v-model:rail="isRail"
    :permanent="true"
    elevation="2"
    expand-on-hover
    @update:rail="toggleGroups"
  >
    <v-list class="user-info">
      <v-list-item prepend-icon="mdi-account-multiple">
        <v-list-item-title>{{ userStore.userInfo?.name ?? '-' }}</v-list-item-title>
        <v-tooltip
          :text="userStore.userInfo?.loginId ?? '-'"
          location="bottom"
        >
          <template #activator="{ props }">
            <v-list-item-subtitle v-bind="props">
              {{ userStore.userInfo?.loginId ?? '-' }}
            </v-list-item-subtitle>
          </template>
        </v-tooltip>
        <template #append>
          <div class="flex-c align-center">
            <v-btn
              border="sm"
              size="x-small"
              to="/main"
              variant="outlined"
            >
              메인
            </v-btn>
            <v-btn
              icon="mdi-logout"
              size="x-small"
              variant="flat"
              @click="logout"
            />
          </div>
        </template>
      </v-list-item>
    </v-list>

    <v-divider />

    <v-list
      v-model:opened="openedGroups"
      open-strategy="multiple"
      @update:opened="updateOpened"
    >
      <div
        v-for="menu in menus"
        :key="menu.value"
      >
        <v-list-group
          v-if="menu.submenus"
          :value="menu.title"
        >
          <template #activator="{ props }">
            <v-list-item
              :prepend-icon="menu.icon"
              color="blue"
              v-bind="{...props, ...menu}"
            />
          </template>
          <div
            v-for="submenu in menu.submenus"
            :key="submenu.value"
          >
            <v-list-item
              :prepend-icon="submenu.icon"
              color="blue"
              v-bind="submenu"
            />
          </div>
        </v-list-group>
        <v-list-item
          v-else
          :prepend-icon="menu.icon"
          color="blue"
          v-bind="menu"
        />
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<style lang="scss" scoped>
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
}
</style>
