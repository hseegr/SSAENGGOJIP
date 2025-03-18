package com.sds.baseproject.common.security.userdetails;

import org.springframework.context.ApplicationEvent;

/**
 * 사용자 정보 cache 초기화를 위해 사용되며 별도의 내용은 담지 않아도 된다.
 */
public class UserDetailsCacheEvictEvent extends ApplicationEvent {
    public UserDetailsCacheEvictEvent(Object source) {
        super(source);
    }
}
