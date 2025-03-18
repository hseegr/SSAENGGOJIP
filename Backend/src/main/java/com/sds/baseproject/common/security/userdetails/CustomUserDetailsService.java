package com.sds.baseproject.common.security.userdetails;

import com.sds.baseproject.accesscontrol.repository.IpAllowlistRepository;
import com.sds.baseproject.common.util.HttpServletRequestUtil;
import com.sds.baseproject.common.util.RoleName;
import com.sds.baseproject.role.entity.UserRole;
import com.sds.baseproject.user.entity.User;
import com.sds.baseproject.user.repository.UserRepository;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.event.EventListener;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import static com.sds.baseproject.common.security.userdetails.CustomUserDetails.withUserId;

/**
 * UserRepository 에서 실제 사용자 정보를 찾아 Spring Security 에 담을 수 있는 형태로 변환을 해주는 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    private final IpAllowlistRepository ipAllowlistRepository;

    private final HttpServletRequest servletRequest;

    /**
     * 동일한 class 내부의 메소드를 직접 호출 할 경우 @Cacheable. @Transactional 등 proxy 패턴이 적용된 기능들이 동작하지 않는다.
     * 해당 기능들을 이용하기 위해서는 bean 에 등록된 자신을 @Lazy @Resource 어노테이션을 이용하여 받아와 proxy 객체를 호출해야한다.
     */
    @Lazy
    @Resource
    CustomUserDetailsService self;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return this.self.loadUserByUsernameAndIp(username, HttpServletRequestUtil.getRemoteAddr(servletRequest));
    }

    /**
     * Repository 에서 사용자 정보를 불러와 UserDetails 로 만들어준다.
     * 허용된 ip에 대해서만 admin 권한을 주도록 설계되어있어 동일한 사용자를 조회하더라도 요청자 ip에 따라서 권한 정보가 다르게 반환된다.
     *
     * @param username loginId
     * @param ip       api 호출자의 ip
     * @return 사용자 정보
     */

    @Cacheable(value = "userDetails", key = "#username + '_' + #ip")
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsernameAndIp(String username, String ip) {
        Optional<User> foundUser = this.userRepository.findByLoginId(username);
        if (foundUser.isEmpty()) {
            throw new UsernameNotFoundException(username);
        }
        User user = foundUser.get();

        CustomUserDetails.UserBuilder builder = withUserId(user.getUserId()).username(user.getLoginId()).authorities(AuthorityUtils.createAuthorityList(this.getRoleIds(user, ip)));

        if (StringUtils.hasText(user.getPassword())) {
            builder.password(user.getPassword());
        }
        return builder.build();
    }


    /**
     * 사용자 권한을 string 형태로 변환하면서 허용 ip에 대해서만 admin 권한을 부여한다.
     *
     * @param user 사용자 Entity
     * @param ip   api 호출자의 ip
     * @return RoleIds
     */
    private List<String> getRoleIds(User user, String ip) {
        boolean isAnyIpAllowed = this.ipAllowlistRepository.existsByIpAddr("0.0.0.0");
        boolean isIpAllowlist = this.ipAllowlistRepository.existsByIpAddr(ip);
        Stream<String> roleIdStream = user.getUserRoles().stream().map(UserRole::getRoleId);
        if (!isAnyIpAllowed && !isIpAllowlist) {
            roleIdStream = roleIdStream.filter(roleId -> (!roleId.equals(RoleName.ROLE_ADMIN.name()) && !roleId.equals(RoleName.ROLE_SYSADMIN.name())));
        }

        return roleIdStream.toList();
    }

    /**
     * 사용자 정보 cache 를 초기화 한다.
     *
     * @param event UserDetailsCacheEvictEvent
     */
    @EventListener
    @CacheEvict(value = "userDetails", allEntries = true)
    public void evictCache(UserDetailsCacheEvictEvent event) {
        log.info("User details cache has been evicted.");
    }
}
