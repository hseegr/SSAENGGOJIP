package com.sds.baseproject.sso.service;

import com.sds.baseproject.sso.payload.SsoAuthToken;
import com.sds.baseproject.user.payload.UserRequestForSso;

public interface SsoService {
    String getAuthCodeRequestUrl();

    SsoAuthToken getSsoAuthToken(String code);

    UserRequestForSso getLoginUserInfo(SsoAuthToken token);
}
