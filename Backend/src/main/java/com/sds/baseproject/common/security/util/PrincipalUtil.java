package com.sds.baseproject.common.security.util;

import com.sds.baseproject.common.security.userdetails.CustomUserDetails;
import com.sds.baseproject.common.util.ProfileUtil;
import com.sds.baseproject.common.util.RoleName;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;

import java.security.Principal;
import java.util.Arrays;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Principal에서 원하는 정보를 활용하기 위한 Util 클래스
 */
public class PrincipalUtil {
    private PrincipalUtil() {
    }

    /**
     * Get userId from Principal.
     *
     * @param principal is should be UsernamePasswordAuthenticationToken
     * @return userid or ""
     */
    public static String getUserId(Principal principal) {
        Optional<CustomUserDetails> customUserDetails = getUserPrincipal(principal);
        if (customUserDetails.isPresent()) {
            return customUserDetails.get().getUserId();
        } else {
            return "";
        }
    }

    /**
     * Get userName from Principal.
     *
     * @param principal is should be UsernamePasswordAuthenticationToken
     * @return userid or ""
     */
    public static String getName(Principal principal) {
        Optional<CustomUserDetails> customUserDetails = getUserPrincipal(principal);
        if (customUserDetails.isPresent()) {
            return customUserDetails.get().getUsername();
        } else {
            return "";
        }
    }

    /**
     * Get email from Principal.
     *
     * @param principal is should be UsernamePasswordAuthenticationToken
     * @return email or ""
     */
    public static String getLoginId(Principal principal) {
        if (principal instanceof UsernamePasswordAuthenticationToken token) {
            return token.getName();
        }
        return "";
    }

    /**
     * Check if the principal has a role.
     *
     * @param principal UserPrincipal.
     * @param roleNames Role Name to check.
     * @return true or false.
     */
    public static boolean checkRole(Principal principal, RoleName... roleNames) {
        Optional<CustomUserDetails> customUserDetails = getUserPrincipal(principal);
        if (customUserDetails.isPresent()) {
            return checkRole(customUserDetails.get(), roleNames);
        } else {
            return false;
        }
    }

    public static boolean checkRole(CustomUserDetails customUserDetails, RoleName... roleNames) {
        if (customUserDetails != null) {
            Set<String> roleNameSet =
                    Arrays.stream(roleNames).map(RoleName::name).collect(Collectors.toSet());
            return customUserDetails.getAuthorities().stream()
                    .anyMatch(
                            auth -> roleNameSet.contains(auth.getAuthority()));
        }
        return false;
    }

    public static String getUserIdOfCurrent() {
        return getUserId(SecurityContextHolder.getContext().getAuthentication());
    }

    public static String getNameOfCurrent() {
        return getName(SecurityContextHolder.getContext().getAuthentication());
    }

    public static boolean checkRoleOfCurrent(RoleName... roleName) {
        return checkRole(SecurityContextHolder.getContext().getAuthentication(), roleName);
    }

    private static Optional<CustomUserDetails> getUserPrincipal(Principal principal) {
        if (principal instanceof UsernamePasswordAuthenticationToken token) {
            Object tokenPrincipal = token.getPrincipal();
            if (tokenPrincipal instanceof CustomUserDetails customUserDetails) {
                return Optional.of(customUserDetails);
            } else if (ProfileUtil.hasProfile("test") && tokenPrincipal instanceof User user) {
                return Optional.of(
                        new CustomUserDetails(
                                user.getUsername(),
                                null,
                                null,
                                false,
                                false,
                                false,
                                false,
                                user.getAuthorities()));
            }
        }
        return Optional.empty();
    }
}
