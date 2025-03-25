package com.ssaenggojip.auth.infrastructure;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.ToString;

@ToString
public class NaverUserInfo {

    @JsonProperty("response")
    private NaverAccount naverAccount;

    public String getSocialLoginId() {
        return naverAccount.socialLoginId;
    }

    public String getEmail() {
        return naverAccount.email;
    }

    private static class NaverAccount {
        @JsonProperty("id")
        private String socialLoginId;

        @JsonProperty("email")
        private String email;
    }
}