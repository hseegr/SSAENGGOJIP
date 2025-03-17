package com.sds.baseproject.accesscontrol.controller;

import com.sds.baseproject.accesscontrol.payload.IpAllowlistRequest;
import com.sds.baseproject.accesscontrol.payload.IpAllowlistSearchRequest;
import com.sds.baseproject.accesscontrol.payload.IpAllowlistSummary;
import com.sds.baseproject.accesscontrol.service.IpAllowlistService;
import com.sds.baseproject.common.paylod.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ip-allowlist")
@Secured({"ROLE_SYSADMIN"})
@Tag(name = "허용 IP 관리", description = "사용자 IP 기반 시스템 접속 제어를 통해 시스템 보안을 향상 시킬 수 있습니다.")
public class IpAllowlistController {
    private final IpAllowlistService ipAllowlistService;

    @GetMapping
    @Operation(summary = "시스템 접속 허용 IP 목록 조회", description = "시스템 접속을 허용하는 IP 목록을 조회한다")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(description = "시스템 접속 허용 IP 목록")
    public ResponseEntity<Page<IpAllowlistSummary>> getIpAllowlistPage(
            @Parameter(description = "특정 시스템 허용 IP를 검색하기 위한 키워드") IpAllowlistSearchRequest searchRequest,
            @Parameter(description = "페이징 처리에 필요한 정보 객체") Pageable pageable) {
        return ResponseEntity.ok(this.ipAllowlistService.getIpAllowlistPage(searchRequest, pageable));
    }

    @PostMapping
    @Operation(summary = "시스템 접속 허용 IP 등록", description = "시스템 접속을 허용하는 IP를 등록한다")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(description = "시스템 접속 허용 IP 등록 완료")
    public ResponseEntity<ApiResponse> saveIpAllowlist(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "등록할 시스템 접속 허용 IP와 IP에 대한 설명")
            @RequestBody IpAllowlistRequest request) {
        ApiResponse apiResponse = this.ipAllowlistService.saveIpAllowlist(request);
        return ResponseEntity.status(apiResponse.getStatus()).body(apiResponse);
    }

    @PutMapping
    @Operation(summary = "시스템 접속 허용 IP 수정", description = "시스템 접속을 허용하는 IP를 수정한다")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(description = "시스템 접속 허용 IP 수정 완료")
    public ResponseEntity<ApiResponse> updateIpAllowlist(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "수정할 시스템 접속 허용 IP와 IP에 대한 설명")
            @RequestBody IpAllowlistRequest request) {
        this.ipAllowlistService.updateIpAllowlist(request);
        return ResponseEntity.ok(new ApiResponse(true, "updated"));
    }

    @DeleteMapping
    @Operation(summary = "시스템 접속 허용 IP 삭제", description = "시스템 접속을 허용하는 IP를 삭제한다")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(description = "시스템 접속 허용 IP 삭제 완료")
    public ResponseEntity<ApiResponse> deleteIpAllowlists(
            @Parameter(description = "삭제할 시스템 접속 허용 IP 목록", example = "[\"127.0.0.1\"]")
            @RequestParam String[] ips) {
        this.ipAllowlistService.deleteIpAllowlists(ips);
        return ResponseEntity.ok(new ApiResponse(true, "deleted"));
    }
}
