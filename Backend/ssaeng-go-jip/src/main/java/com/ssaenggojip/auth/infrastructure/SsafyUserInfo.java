package com.ssaenggojip.auth.infrastructure;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.ToString;

@ToString
public class SsafyUserInfo {

    @Getter
    @JsonProperty("userId")
    private String socialLoginId;

    @Getter
    @JsonProperty("email")
    private String email;
}