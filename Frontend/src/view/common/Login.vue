<template>
  <div>
    <v-card
        class="mx-auto mt-16 pa-12 pb-8 "
        elevation="8"
        max-width="448"
        rounded="lg"
    >
      <template v-slot:title>
        <span class="font-weight-black">Welcome to Base Project</span>
      </template>
      <v-form v-model="isValid" fast-fail @submit.prevent>
        <v-text-field
            v-model="loginId"
            :rules="[rules.required, rules.email]"
            class="mb-2"
            label="Email address"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
        ></v-text-field>

        <v-text-field
            v-model="password"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :rules="[rules.required]"
            :type="visible ? 'text' : 'password'"
            class="mb-2"
            label="Password"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            @click:append-inner="visible = !visible"
            @keydown.enter="handleLogin"
        ></v-text-field>

        <v-card
            class="mb-12"
            color="surface-variant"
            variant="tonal"
        >
          <v-card-text class="text-medium-emphasis text-caption">
            Warning: After 3 consecutive failed login attempts, you account will be temporarily locked for three hours.
            If
            you must login now, you can also click "Forgot login password?" below to reset the login password.
          </v-card-text>
        </v-card>

        <v-btn
            block
            class="mb-8"
            color="blue"
            size="large"
            type="submit"
            variant="tonal"
            @click="handleLogin"
        >
          Log In
        </v-btn>
        <v-btn
            block
            class="mb-8"
            color="blue"
            size="large"
            variant="tonal"
            @click="handleSSOLogin('ssafy')"
        >
          SSAFY SSO
        </v-btn>
      </v-form>
    </v-card>
  </div>
</template>

<script lang="ts">

import {defineComponent} from "vue";
import {login} from "@/api/auth/AuthApi.ts";
import {useUserStore} from "@/store/user.ts";
import {email, required} from "@/util/validationUtil.ts";
import {useCommonDialog} from "@/store/commonDialog.ts";
import {getAuthorizationUri} from "@/api/sso/SsoApi.ts";
import commonDialog from "@/components/common/CommonDialog.vue";

export default defineComponent({
  name: 'login',
  setup() {
    return {
      commonDialog: useCommonDialog(),
      userStore: useUserStore(),
    }
  },
  data() {
    return {
      loginId: '',
      password: '',
      isValid: false,
      visible: false,
      rules: {
        email,
        required,
      }
    }
  },
  methods: {
    async handleLogin() {
      if (!this.isValid) {
        await this.commonDialog.showCommonDialog({
          title: "Invalid",
          message: "잘못된 입력값이 있습니다.",
          type: 'warn',
        });
        return;
      }

      let authenticationResponse = await login({username: this.loginId, password: this.password});
      if (authenticationResponse?.jwt) {
        localStorage.setItem("accessToken", authenticationResponse.jwt);
        this.$router.push({
          path: this.$route.query.returnPath as string || '/',
          query: JSON.parse(this.$route.query.returnQuery as string || '{}'),
        });
      }
    },
    /**
     * SSO 로그인을 위한 인가 코드 요청 URL 조회 메서드
     *
     * 사용자가 선택한 SSO 제공자(provider)를 통해 인가 코드를 획득하기 위한 주소를 조회하고, 조회된 주소로 리다이렉트합니다.
     * 실패 시, 에러 다이얼로그를 표시합니다.
     *
     * - 인가 코드 요청 URL은 각 Provider별 Config에 정의되며, 선택한 Provider의 로그인 화면으로 이동합니다.
     * - 로그인이 완료되면 인가 코드와 함께 각 Provider별 Config에 정의된 Redirect URL로 요청이 옵니다.
     * - Base Project에서는 Rediect URL 요청이 오면 Vue Router에 의해 SsoCallback.vue 컴포넌트가 마운트됩니다.
     *
     * @param provider SSO 인증 제공자 이름 (현재는 'ssafy'만 지원)
     *
     * SSO 로그인은 다음과 같은 단계로 진행됩니다:
     * 1. 인가 코드 요청 URL 조회 (Login.vue -> SsoController.java -> Login.vue)
     * 2. 반환된 URL로 리다이렉트하여 로그인 진행 (Login.vue -> Provider 로그인 진행)
     * 3. 로그인 완료 후 사전에 정의된 Redirect URL로 인가 코드 전달 (Provider -> SsoCallback.vue)
     * 4. 발급된 인가 코드로 로그인 진행 및 인증 토큰 저장 (SsoCallback.vue -> SsoController.java -> SsoCallback.vue)
     * 5. 초기 설정된 ssoReturnPath 로 이동
     */
    async handleSSOLogin(provider: string) {
      // 인가 코드 획득을 위한 URL을 비동기적으로 조회
      const authCodeUrlString = await getAuthorizationUri(provider);
      if (authCodeUrlString) {
        const searchParams = new URLSearchParams();
        searchParams.append("ssoReturnPath", this.$route.query.returnPath as string || '/');
        searchParams.append("ssoReturnQuery", this.$route.query.returnQuery as string || '{}');

        const autCodeUrl = new URL(authCodeUrlString);
        autCodeUrl.searchParams.append("state", searchParams.toString());
        // 반환된 인증 URL 리다이렉트
        window.location.href = autCodeUrl.toString();
      } else {
        await commonDialog.showCommonDialog({
          title: "Authorization Uri Error",
          message: '인가 코드 획득을 위한 주소 조회에 실패하였습니다.',
          type: 'error',
        });
      }
    },
  }
})
</script>
