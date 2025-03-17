package com.sds.baseproject.user.payload;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequestForSso {
    private String userId;
    private String loginId;
    private String name;

    public void setEmail(String email) {
        this.loginId = email;
    }
}
