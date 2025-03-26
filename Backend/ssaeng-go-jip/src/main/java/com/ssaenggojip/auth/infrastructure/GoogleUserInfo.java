package com.ssaenggojip.auth.infrastructure;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.ToString;

@ToString
public class GoogleUserInfo {

    @Getter
    @JsonProperty("sub")
    private String socialLoginId;

    @Getter
    @JsonProperty("email")
    private String email;
}