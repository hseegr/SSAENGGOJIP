package com.sds.baseproject.user.service;

import com.sds.baseproject.common.paylod.ApiResponse;
import com.sds.baseproject.user.payload.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {

    Page<UserSummary> getUserPage(UserSearchRequest searchRequest, Pageable pageable);

    UserSummaryForAuthentication getSummaryForAuthentication(String userId);

    UserSummary getUserByLoginId(String loginId);

    String saveUserIfAbsent(UserRequestForSso userRequest);

    ApiResponse saveUser(UserRequest userRequest);

    ApiResponse updateUser(String userId, UserRequest userRequest);
}
