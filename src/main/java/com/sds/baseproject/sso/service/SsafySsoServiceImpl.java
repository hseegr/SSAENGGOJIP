package com.sds.baseproject.sso.service;

import com.sds.baseproject.common.exception.AppException;
import com.sds.baseproject.sso.config.SsafyConfig;
import com.sds.baseproject.sso.payload.SsoAuthToken;
import com.sds.baseproject.user.payload.UserRequestForSso;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
@RequiredArgsConstructor
public class SsafySsoServiceImpl implements SsoService {

    private final SsafyConfig ssafyConfig;

    @Override
    public String getAuthCodeRequestUrl() {
        return UriComponentsBuilder
                .fromUriString(ssafyConfig.authorizationUri())
                .queryParam("client_id", ssafyConfig.clientId())
                .queryParam("redirect_uri", ssafyConfig.redirectUri())
                .queryParam("response_type", "code")
                .build()
                .toUriString();
    }

    /**
     * SSO 인증 서버로부터 인증 토큰(SsoAuthToken)을 가져오는 메서드
     *
     * 전달받은 인증 코드를 사용하여 인증 토큰 요청에 필요한 HttpEntity를 생성합니다.
     * RestTemplate을 이용해 SSO 인증 서버에 POST 요청을 보냅니다.
     * 응답이 성공일 경우, 인증 토큰(SsoAuthToken)을 반환합니다.
     *
     * @param code 사용자가 전달한 인증 코드
     * @return SsoAuthToken 인증 토큰 객체
     *
     */
    @Override
    public SsoAuthToken getSsoAuthToken(String code) {
        final HttpEntity<MultiValueMap<String, String>> httpEntity = createTokenRequestEntity(code);

        RestTemplate restTemplate = new RestTemplate();
        try {
            ResponseEntity<SsoAuthToken> response = restTemplate.exchange(ssafyConfig.tokenUri(), HttpMethod.POST, httpEntity,
                    SsoAuthToken.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody();
            } else {
                throw new AppException("인증 서버로부터 AuthToken 정보를 가져오는데 실패하였습니다.",
                        new AuthenticationServiceException("Authentication Failed with code " + response.getStatusCode()));
            }
        } catch (HttpClientErrorException ex) {
            throw new AppException("인증 서버로부터 AuthToken 정보를 가져오는데 실패하였습니다.\n관리자에게 문의하세요.", ex);
        }
    }

    /**
     * SSO 인증 서버로부터 로그인 사용자 정보를 가져오는 메서드
     *
     * 전달받은 액세스 토큰을 사용하여 사용자 정보 요청에 필요한 HttpEntity를 생성합니다.
     * RestTemplate을 이용해 SSO 인증 서버에 GET 요청을 보냅니다.
     * 응답이 성공힐 경우, 사용자 정보(UserRequestForSso)를 반환합니다.
     *
     * @param token SsoAuthToken 객체로부터 얻은 액세스 토큰
     * @return UserRequestForSso 로그인 사용자 정보를 포함한 객체
     *
     */
    @Override
    public UserRequestForSso getLoginUserInfo(SsoAuthToken token) {
        final HttpEntity<MultiValueMap<String, String>> httpEntity = createUserInfoRequestEntity(token.getAccess_token());
        RestTemplate restTemplate = new RestTemplate();
        try {
            ResponseEntity<UserRequestForSso> response = restTemplate.exchange(ssafyConfig.userInfoUri(), HttpMethod.GET, httpEntity, UserRequestForSso.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody();
            } else {
                throw new AppException("인증 서버로부터 사용자 정보를 가져오는데 실패하였습니다.",
                        new AuthenticationServiceException("Authentication Failed with code " + response.getStatusCode()));
            }
        } catch (HttpClientErrorException ex) {
            throw new AppException("인증 서버로부터 사용자 정보를 가져오는데 실패하였습니다.", ex);
        }
    }

    private HttpEntity<MultiValueMap<String, String>> createTokenRequestEntity(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", ssafyConfig.clientId());
        params.add("client_secret", ssafyConfig.clientSecret());
        params.add("redirect_uri", ssafyConfig.redirectUri());
        params.add("code", code);

        return new HttpEntity<>(params, headers);
    }

    private HttpEntity<MultiValueMap<String, String>> createUserInfoRequestEntity(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + token);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        return new HttpEntity<>(headers);
    }
}
