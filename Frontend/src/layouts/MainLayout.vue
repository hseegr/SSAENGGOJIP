<script lang="ts" setup>
import {Ref, ref} from "vue";
import {useRouter} from "vue-router";
import {useUserStore} from "@/store/user.ts";
import Introduction from "@/view/main/Introduction.vue";
import Example from "@/view/main/Example.vue";

const router = useRouter();
const userStore = useUserStore();

const isAdmin = userStore.hasRole('ROLE_ADMIN');

const login = () => router.push('/login');
const logout = () => {
  userStore.logout();
  router.go(0);
}
const introduction = <Ref<HTMLDivElement | null>>ref(null);
const example = <Ref<HTMLDivElement | null>>ref(null);

const scrollToComponent = (component: HTMLDivElement | null) => {
  component?.scrollIntoView({behavior: "smooth"});
}

const scrollToTop = () => {
  window.scrollTo({top: 0, behavior: "smooth"});
}
</script>

<template>
  <div class="main">
    <div class="page">
      <v-toolbar
          class="px-10"
          color="white"
      >
        <v-btn
            :active="false"
            class="menu-btn"
            rounded="xl"
            size="large"
            to="/main"
        >
          Base Project
        </v-btn>
        <v-spacer/>
        <div class="flex-r ga-5">
          <v-btn
              class="menu-btn"
              rounded="xl"
              variant="plain"
              @click="scrollToComponent(introduction)"
          >
            <span>소개</span>
          </v-btn>
          <v-btn
              class="menu-btn"
              rounded="xl"
              variant="plain"
              @click="scrollToComponent(example)"
          >
            <span>활용 예시</span>
          </v-btn>
          <template
              v-if="userStore.isAuthenticated"
          >
            <v-btn
                v-if="isAdmin"
                class="menu-btn"
                color="primary"
                rounded="xl"
                to="/admin"
                variant="flat"
            >
              ADMIN
            </v-btn>
            <v-menu>
              <template #activator="{ props }">
                <v-btn
                    class="menu-btn"
                    prepend-icon="mdi-account"
                    rounded="xl"
                    v-bind="props"
                    variant="tonal"
                >
                  {{ userStore.userInfo?.name }}
                </v-btn>
              </template>
              <v-card class="mt-1">
                <v-card-text>
                  <div class="text-center">
                    <h5>{{ userStore.userInfo?.loginId }}</h5>
                    <v-divider class="my-3"/>
                    <v-btn
                        class="font-weight-bold"
                        rounded
                        size="small"
                        variant="text"
                        @click="logout"
                    >
                      로그아웃
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-menu>
          </template>
          <template v-else>
            <v-btn
                class="font-weight-bold"
                prepend-icon="mdi-account"
                rounded="xl"
                variant="tonal"
                @click="login"
            >
              로그인
            </v-btn>
          </template>
        </div>
      </v-toolbar>
      <div ref="introduction"/>
      <Introduction/>
      <div ref="example"/>
      <Example/>
      <v-btn
          class="floating-top-btn"
          color="primary"
          icon="mdi-chevron-double-up"
          @click="scrollToTop"
      />
      <div class="footer px-10">
        <img
            alt="logo_footer"
            src="@/assets/img/logo_footer.png"
        >
        <span class="ml-3">© SAMSUNG</span>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.menu-btn {
  font-weight: 700;
}

.floating-top-btn {
  position: fixed;
  right: 50px;
  bottom: 50px;
}
</style>
