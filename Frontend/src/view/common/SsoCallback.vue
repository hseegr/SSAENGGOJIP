<script lang="ts" setup>
import {onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import {ssoLogin} from "@/api/sso/SsoApi.ts";

const route = useRoute();
const router = useRouter();
/**
 * 해당 컴포넌트는 다음과 같은 특징과 역할을 가지고 있습니다:
 *
 * 1. 사전에 설정된 Redirect URL에 의해 호출됩니다.
 *  - SSO 제공자가 인증 후, 정의된 Redirect URL로 사용자를 리다이렉트할 때 이 컴포넌트가 실행됩니다.
 * 2. UI 없이 동작합니다.
 *  - 사용자 인터페이스를 제공하지 않고, HTML은 비어 있습니다. 대신, 인증 코드를 처리하는 로직과 화면 전환 기능만 수행합니다.
 */

/**
 * SSO 로그인 처리 메서드
 *
 * - Provider에서 로그인이 완료된 후, 인가 코드를 발급하여 Redirect URL로 요청을 보냅니다.
 * - 발급된 인가 코드로 로그인을 진행하고, 로그인이 완료되면 로컬 스토리지에 인증 토큰을 저장합니다.
 *
 */
onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const error = urlParams.get('error');
  const provider = route.params.provider as string;

  if (error) {
    await router.push('/login');
  }

  if (code) {
    let authenticationResponse = await ssoLogin(provider, code);
    if (authenticationResponse?.jwt) {
      localStorage.setItem("accessToken", authenticationResponse.jwt);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const state = urlParams.get('state') ?? "";

    const stateParams = new URLSearchParams(state);
    const ssoReturnPath = stateParams.get('ssoReturnPath') ?? '/';
    const ssoReturnQuery = JSON.parse(stateParams.get('ssoReturnQuery') as string || '{}');

    router.push({
      path: ssoReturnPath,
      query: ssoReturnQuery,
    });
  }
})
</script>


