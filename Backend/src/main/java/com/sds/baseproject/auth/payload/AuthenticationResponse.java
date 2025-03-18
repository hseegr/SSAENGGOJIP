package com.sds.baseproject.auth.payload;

import lombok.Getter;

@Getter
public class AuthenticationResponse {
    private String jwt;

    public AuthenticationResponse(String jwt) {
        this.jwt = jwt;
    }
}
