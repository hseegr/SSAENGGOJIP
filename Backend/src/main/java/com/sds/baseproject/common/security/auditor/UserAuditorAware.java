package com.sds.baseproject.common.security.auditor;

import com.sds.baseproject.common.security.userdetails.CustomUserDetails;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

/**
 * 사용자 정보를 자동기록하기 위한 Component.
 * 현재 Controller를 호출한 user의 userId를 추출하여 리턴한다.
 * CustomUserDetails 에 대하서만 동작한다. 만약 UserDetails를 다른 형태로 변경했다면 그에 맞게 변경해주어야 한다.
 */
public class UserAuditorAware implements AuditorAware<String> {
    @Override
    public Optional<String> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken
                || authentication.getPrincipal() == null
                || !(authentication.getPrincipal() instanceof CustomUserDetails)) {
            return Optional.empty();
        }

        return Optional.ofNullable(((CustomUserDetails) authentication.getPrincipal()).getUserId());
    }
}
