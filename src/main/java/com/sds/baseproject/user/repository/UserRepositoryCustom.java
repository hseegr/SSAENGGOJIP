package com.sds.baseproject.user.repository;

import com.sds.baseproject.user.entity.User;
import com.sds.baseproject.user.payload.UserSearchRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserRepositoryCustom {
    Page<User> getUserPage(UserSearchRequest searchRequest, Pageable pageable);
}
