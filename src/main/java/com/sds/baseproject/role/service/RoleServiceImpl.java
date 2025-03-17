package com.sds.baseproject.role.service;

import com.sds.baseproject.common.exception.ResourceNotFoundException;
import com.sds.baseproject.common.paylod.ApiResponse;
import com.sds.baseproject.common.util.CollectionUtil;
import com.sds.baseproject.role.converter.RoleConverter;
import com.sds.baseproject.role.entity.Role;
import com.sds.baseproject.role.entity.UserRole;
import com.sds.baseproject.role.payload.*;
import com.sds.baseproject.role.repository.RoleRepository;
import com.sds.baseproject.role.repository.UserRoleRepository;
import com.sds.baseproject.user.payload.UserSummarySimple;
import com.sds.baseproject.user.repository.UserRepository;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class RoleServiceImpl implements RoleService {
  private final RoleRepository roleRepository;
  private final UserRepository userRepository;

  private final UserRoleRepository userRoleRepository;
  private final RoleConverter roleConverter;

  @Override
  public List<RoleSummarySimple> getRoleList() {
    return CollectionUtil.transform(
        this.roleRepository.findAll(), this.roleConverter::toRoleSimple);
  }

  @Override
  public Page<RoleSummaryForList> getRolePage(String keyword, Pageable pageable) {
    Page<RoleSummaryForList> page =
        this.roleRepository.search(keyword, pageable).map(this.roleConverter::toRoleSummaryForList);
    Map<String, Long> userCountMap =
        this.roleRepository.getUserCountMap(
            page.map(RoleSummaryForList::getRoleId).stream().toList());
    page.forEach(
        summary -> summary.setUserCount(userCountMap.getOrDefault(summary.getRoleId(), 0L)));
    return page;
  }

  @Override
  public RoleSummary getRoleSummary(String roleId) {
    RoleSummary summary =
        this.roleConverter.toRoleSummary(this.roleRepository.getReferenceById(roleId));
    summary.getUsers().sort(Comparator.comparing(UserSummarySimple::getName));
    return summary;
  }

  @Override
  @Transactional
  public ApiResponse saveRole(String roleId, RoleRequest roleRequest) {
    Role role;
    boolean isUpdated = false;

    if (this.roleRepository.existsByRoleId(roleId)) {
      isUpdated = true;
      role = this.roleRepository.getReferenceById(roleId);
      role.setDescription(roleRequest.getDescription());
    } else {
      role = this.roleConverter.toRole(roleRequest);
      role.setRoleId(roleId);
    }

    CollectionUtil.deleteOrUpdateOrInsert(
        role.getUserRoles(),
        roleRequest.getUserIdList(),
        UserRole::getUserId,
        Function.identity(),
        null,
        null,
        userId -> {
          if (this.userRepository.existsById(userId)) {
            UserRole userRole = new UserRole();
            userRole.setUserId(userId);
            userRole.setRoleId(roleId);
            userRole = this.userRoleRepository.save(userRole);
            role.getUserRoles().add(userRole);
            return userRole;
          } else {
            throw new ResourceNotFoundException("User", "userId", userId);
          }
        });

    this.roleRepository.save(role);
    return new ApiResponse(
        true, isUpdated ? HttpStatus.OK : HttpStatus.CREATED, "saved", role.getRoleId());
  }

  @Override
  public ApiResponse deleteRole(String roleId) {
    if (!this.roleRepository.existsByRoleId(roleId)) {
      throw new ResourceNotFoundException("ROLE", "roleId", roleId);
    }

    if (this.userRoleRepository.existsByRoleId(roleId)) {
      return new ApiResponse(false, HttpStatus.CONFLICT, "사용자가 있는 ROLE 은 삭제할 수 없습니다.");
    }

    this.roleRepository.deleteById(roleId);
    return new ApiResponse(true, "deleted");
  }
}
