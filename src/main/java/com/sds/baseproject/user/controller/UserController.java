package com.sds.baseproject.user.controller;

import com.sds.baseproject.common.paylod.ApiResponse;
import com.sds.baseproject.common.security.util.PrincipalUtil;
import com.sds.baseproject.user.payload.UserRequest;
import com.sds.baseproject.user.payload.UserSearchRequest;
import com.sds.baseproject.user.payload.UserSummary;
import com.sds.baseproject.user.payload.UserSummaryForAuthentication;
import com.sds.baseproject.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
@Tag(name = "사용자 관리", description = "사용자를 등록, 수정하거나 조회할 수 있습니다.")
public class UserController {
    private final UserService userService;

    @GetMapping
    @Secured({"ROLE_SYSADMIN"})
    @Operation(summary = "사용자 목록 조회", description = "사용자 목록을 조회한다")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(description = "사용자 목록")
    public ResponseEntity<Page<UserSummary>> getUserPage(
            @Parameter(description = "사용자를 검색하기 위한 키워드와 지역코드") UserSearchRequest searchRequest,
            @Parameter(description = "페이징 처리에 필요한 정보 객체") Pageable pageable) {
        return ResponseEntity.ok(this.userService.getUserPage(searchRequest, pageable));
    }

    @GetMapping(value = "my-info", params = "for=auth")
    @Operation(summary = "현재 사용자의 상세 정보 조회", description = "인증을 위해 현재 사용자의 정보을 조회한다")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(description = "현재 사용자의 상세 정보")
    @Parameter(name = "for", description = "인증 목적을 뜻함", example = "auth")
    public ResponseEntity<UserSummaryForAuthentication> getDetail(Principal principal) {
        return ResponseEntity.ok(this.userService.getSummaryForAuthentication(PrincipalUtil.getUserId(principal)));
    }

    @PostMapping
    @Operation(summary = "사용자 등록", description = "사용자를 등록한다")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(description = "사용자 등록 완료")
    @Secured({"ROLE_SYSADMIN"})
    public ResponseEntity<ApiResponse> saveUser(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "등록할 특정 사용자의 정보")
            @RequestBody UserRequest userRequest) {
        return ResponseEntity.ok(this.userService.saveUser(userRequest));
    }

    @PatchMapping("{userId}")
    @Operation(summary = "사용자 수정", description = "사용자를 수정한다")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(description = "사용자 수정 완료")
    @Secured({"ROLE_SYSADMIN"})
    public ResponseEntity<ApiResponse> updateUser(
            @Parameter(description = "수정할 특정 사용자의 ID")
            @PathVariable String userId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "수정할 특정 사용자의 정보")
            @RequestBody UserRequest userRequest) {
        return ResponseEntity.ok(this.userService.updateUser(userId, userRequest));
    }
}
