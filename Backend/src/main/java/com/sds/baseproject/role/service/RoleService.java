package com.sds.baseproject.role.service;

import com.sds.baseproject.common.paylod.ApiResponse;
import com.sds.baseproject.role.payload.RoleRequest;
import com.sds.baseproject.role.payload.RoleSummary;
import com.sds.baseproject.role.payload.RoleSummaryForList;
import com.sds.baseproject.role.payload.RoleSummarySimple;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RoleService {

    List<RoleSummarySimple> getRoleList();

    Page<RoleSummaryForList> getRolePage(String keyword, Pageable pageable);

    RoleSummary getRoleSummary(String roleId);

    ApiResponse saveRole(String roleId, RoleRequest roleRequest);

    ApiResponse deleteRole(String roleId);
}
