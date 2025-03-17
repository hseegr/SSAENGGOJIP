package com.sds.baseproject.role.controller;

import com.sds.baseproject.common.paylod.ApiResponse;
import com.sds.baseproject.role.payload.RoleRequest;
import com.sds.baseproject.role.payload.RoleSummary;
import com.sds.baseproject.role.payload.RoleSummaryForList;
import com.sds.baseproject.role.payload.RoleSummarySimple;
import com.sds.baseproject.role.service.RoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/roles")
@Secured({"ROLE_SYSADMIN"})
@Tag(name = "사용자 권한 관리", description = "사용자 권한 기반 시스템 접속 제어를 통해 시스템 보안을 향상 시킬 수 있습니다.")
public class RoleController {
    private final RoleService roleService;

    @GetMapping
    @Operation(summary = "사용자 권한 목록 조회", description = "사용자 권한 목록을 조회한다")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(description = "사용자 권한 목록")
    public ResponseEntity<Page<RoleSummaryForList>> getRolePage(
            @Parameter(description = "사용자 권한 목록을 검색하기 위한 키워드")
            @RequestParam(required = false) String keyword,
            @Parameter(description = "페이징 처리에 필요한 정보 객체") Pageable pageable) {
        return ResponseEntity.ok(this.roleService.getRolePage(keyword, pageable));
    }

    @GetMapping(params = "dataType=simple")
    @Operation(summary = "간소화된 사용자 권한 목록 조회", description = "간소화된 사용자 권한 목록을 조회한다")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(description = "간소화된 사용자 권한 목록")
    @Parameter(name = "dataType", description = "간소화된 데이터 조회 목적을 뜻함", example = "simple")
    public ResponseEntity<List<RoleSummarySimple>> getRoleSimpleList() {
        return ResponseEntity.ok(this.roleService.getRoleList());
    }

    @GetMapping("/{roleId}")
    @Operation(summary = "특정 사용자 권한의 상세 화면 조회", description = "특정 사용자 권한의 상세 화면을 조회한다")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(description = "특정 사용자 권한의 상세 정보")
    public ResponseEntity<RoleSummary> getRoleSummary(
            @Parameter(description = "조회할 특정 사용자 권한의 ID", example = "ROLE_TEST")
            @PathVariable String roleId) {
        return ResponseEntity.ok(this.roleService.getRoleSummary(roleId));
    }

    @PutMapping("/{roleId}")
    @Operation(summary = "특정 사용자 권한 등록/수정", description = "특정 사용자 권한을 등록하거나 수정한다")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(description = "특정 사용자 권한 등록/수정 완료")
    public ResponseEntity<ApiResponse> saveRole(
            @Parameter(description = "등록 또는 수정할 특정 사용자 권한의 ID", example = "ROLE_TEST")
            @PathVariable String roleId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "등록 또는 수정할 특정 사용자 권한의 정보")
            @RequestBody RoleRequest roleRequest) {
        ApiResponse apiResponse = this.roleService.saveRole(roleId, roleRequest);
        return ResponseEntity
                .status(apiResponse.getStatus())
                .body(apiResponse);
    }

    @DeleteMapping("/{roleId}")
    @Operation(summary = "특정 사용자 권한 삭제", description = "특정 사용자 권한을 삭제한다")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(description = "특정 사용자 권한 삭제 완료")
    public ResponseEntity<ApiResponse> deleteRole(
            @Parameter(description = "삭제할 특정 사용자 권한의 ID", example = "ROLE_TEST")
            @PathVariable String roleId) {
        ApiResponse apiResponse = this.roleService.deleteRole(roleId);
        return ResponseEntity
                .status(apiResponse.getStatus())
                .body(apiResponse);
    }
}
