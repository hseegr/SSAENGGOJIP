package com.sds.baseproject.user.service;

import com.sds.baseproject.common.exception.AppException;
import com.sds.baseproject.common.exception.ResourceNotFoundException;
import com.sds.baseproject.common.paylod.ApiResponse;
import com.sds.baseproject.common.security.userdetails.UserDetailsCacheEvictEvent;
import com.sds.baseproject.common.util.CollectionUtil;
import com.sds.baseproject.common.util.ProfileUtil;
import com.sds.baseproject.common.util.RoleName;
import com.sds.baseproject.role.entity.UserRole;
import com.sds.baseproject.role.repository.UserRoleRepository;
import com.sds.baseproject.user.converter.UserConverter;
import com.sds.baseproject.user.entity.User;
import com.sds.baseproject.user.payload.*;
import com.sds.baseproject.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final UserRoleRepository userRoleRepository;

    private final UserConverter userConverter;

    private final PasswordEncoder passwordEncoder;

    private final ApplicationEventPublisher applicationEventPublisher;

    @Override
    public Page<UserSummary> getUserPage(UserSearchRequest searchRequest, Pageable pageable) {
        return this.userRepository.getUserPage(searchRequest, pageable).map(this.userConverter::toUserSummary);
    }

    @Override
    public UserSummaryForAuthentication getSummaryForAuthentication(String userId) {
        return this.userConverter.toUserSummaryForAuthentication(this.userRepository.getReferenceById(userId));
    }

    @Override
    public UserSummary getUserByLoginId(String loginId) {
        return this.userConverter.toUserSummary(
                this.userRepository.findByLoginId(loginId)
                        .orElseThrow(() -> new ResourceNotFoundException("User", "loginId", loginId)));
    }

    @Override
    public ApiResponse saveUser(UserRequest userRequest) {
        if (this.userRepository.existsByLoginId(userRequest.getLoginId())) {
            return new ApiResponse(false, "동일한 Email 을 가진 사용자가 이미 존재합니다.");
        }

        User user = this.userConverter.toUser(userRequest);
        user.setPassword(this.passwordEncoder.encode(userRequest.getPassword()));
        user = this.userRepository.save(user);

        for (String roleId : userRequest.getRoleIds()) {
            UserRole userRole = new UserRole();
            userRole.setUserId(user.getUserId());
            userRole.setRoleId(roleId);
            this.userRoleRepository.save(userRole);
        }

        return new ApiResponse(true, "saved", user.getUserId());
    }

    @Override
    @Transactional
    public ApiResponse updateUser(String userId, UserRequest userRequest) {
        User user = this.userRepository.getReferenceById(userId);
        this.userConverter.updateUser(user, userRequest);
        if (StringUtils.hasText(userRequest.getPassword())) {
            user.setPassword(this.passwordEncoder.encode(userRequest.getPassword()));
        }
        CollectionUtil.deleteOrUpdateOrInsert(
                user.getUserRoles(),
                userRequest.getRoleIds(),
                UserRole::getRoleId,
                Function.identity(),
                null,
                null,
                roleId -> {
                    UserRole userRole = new UserRole();
                    userRole.setUserId(userId);
                    userRole.setRoleId(roleId);
                    return this.userRoleRepository.save(userRole);
                });
        this.applicationEventPublisher.publishEvent(new UserDetailsCacheEvictEvent(user.getLoginId()));
        return new ApiResponse(true, "updated", user.getUserId());
    }

    @Override
    public String saveUserIfAbsent(UserRequestForSso userRequest) {
        Optional<User> foundUser = this.userRepository.findByLoginId(userRequest.getLoginId());
        if (foundUser.isPresent()) {
            User user = foundUser.get();
            if (!user.getUserId().equals(userRequest.getUserId())) {
                throw new AppException("동일한 Email 이 다른 사용자에 등록되어있어 등록이 불가능합니다.",
                        new IllegalArgumentException("userId : " + userRequest.getUserId() + ", login Id : " + userRequest.getLoginId()));
            }
            return userRequest.getLoginId();
        } else {
            User user = this.userConverter.toUser(userRequest);
            user.setRegId(user.getUserId());
            user.setModId(user.getUserId());

            if(ProfileUtil.hasProfile("showcase")) {
                UserRole adminRole = createUserRole(userRequest.getUserId(), RoleName.ROLE_ADMIN.name());
                UserRole sysAdminRole = createUserRole(userRequest.getUserId(), RoleName.ROLE_SYSADMIN.name());

                user.setUserRoles(List.of(adminRole, sysAdminRole));
            } else {
                UserRole defaultRole = createUserRole(userRequest.getUserId(), RoleName.ROLE_USER.name());
                user.setUserRoles(List.of(defaultRole));
            }

            user = this.userRepository.save(user);
            return user.getLoginId();
        }
    }

    private UserRole createUserRole(String userId, String roleName) {
        UserRole userRole = new UserRole();
        userRole.setUserId(userId);
        userRole.setRoleId(roleName);
        userRole.setRegId(userId);
        userRole.setModId(userId);
        return userRole;
    }
}
