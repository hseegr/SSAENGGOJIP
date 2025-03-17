package com.sds.baseproject.role.converter;

import com.sds.baseproject.role.entity.Role;
import com.sds.baseproject.role.entity.UserRole;
import com.sds.baseproject.role.payload.*;
import com.sds.baseproject.user.entity.User;
import com.sds.baseproject.user.payload.UserSummarySimple;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RoleConverter {
  @Mapping(source = "userRoles", target = "users")
  RoleSummary toRoleSummary(Role role);

  RoleSummaryForList toRoleSummaryForList(Role role);

  RoleSummarySimple toRoleSimple(Role role);

  Role toRole(RoleRequest roleDetail);

  UserSummarySimple toUserSummary(User user);

  default UserSummarySimple convertUser(UserRole userRoles) {

    return toUserSummary(userRoles.getUser());
  }
}
