package com.ssaenggojip.auth.infrastructure;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.ToString;

@ToString
public class KakaoUserInfo {

    @Getter
    @JsonProperty("id")
    private String socialLoginId;

    @JsonProperty("kakao_account")
    private KakaoAccount kakaoAccount;

    public String getEmail() {
        return kakaoAccount.email;
    }

    private static class KakaoAccount {
        @JsonProperty("email")
        private String email;
    }
}