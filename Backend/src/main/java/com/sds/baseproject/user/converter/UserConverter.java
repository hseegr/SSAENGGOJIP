package com.sds.baseproject.user.converter;

import com.sds.baseproject.role.entity.UserRole;
import com.sds.baseproject.role.payload.RoleSummarySimple;
import com.sds.baseproject.user.entity.User;
import com.sds.baseproject.user.payload.UserRequest;
import com.sds.baseproject.user.payload.UserRequestForSso;
import com.sds.baseproject.user.payload.UserSummary;
import com.sds.baseproject.user.payload.UserSummaryForAuthentication;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserConverter {
    @Mapping(source = "userRoles", target = "roles")
    UserSummary toUserSummary(User user);

    @Mapping(source = "userRoles", target = "roles")
    UserSummaryForAuthentication toUserSummaryForAuthentication(User user);

    @Mapping(target = "password", ignore = true)
    User toUser(UserRequest userRequest);

    User toUser(UserRequestForSso userRequest);

    @Mapping(target = "loginId", ignore = true)
    @Mapping(target = "password", ignore = true)
    void updateUser(@MappingTarget User user, UserRequest userRequest);

    default String toString(UserRole userRole) {
        return userRole.getRoleId();
    }

    default RoleSummarySimple toRoleSummary(UserRole userRole) {
        RoleSummarySimple summary = new RoleSummarySimple();
        summary.setRoleId(userRole.getRoleId());
        summary.setDescription(userRole.getRole().getDescription());
        return summary;
    }

    default List<String> toStringArray(List<UserRole> userRoles) {
        return userRoles.stream().map(UserRole::getRoleId).toList();
    }

    default String toJoinedString(List<UserRole> userRoles) {
        return userRoles.stream().map(UserRole::getRoleId).collect(Collectors.joining(", "));
    }
}
