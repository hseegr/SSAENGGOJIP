package com.sds.baseproject.error.controller;

import com.sds.baseproject.error.payload.ErrorDetail;
import com.sds.baseproject.error.payload.ErrorSearchRequest;
import com.sds.baseproject.error.payload.ErrorSummary;
import com.sds.baseproject.error.service.ErrorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/errors")
@Secured({"ROLE_SYSADMIN"})
@Tag(name = "시스템 에러", description = "시스템 에러를 조회할 수 있습니다.")
public class ErrorController {

    private ErrorService errorService;

    public ErrorController(ErrorService errorService) {
        this.errorService = errorService;
    }

    @GetMapping
    @Operation(summary = "시스템 에러 목록 조회", description = "시스템 에러 목록을 조회한다")
    @ApiResponse(description = "시스템 에러 목록")
    public ResponseEntity<Page<ErrorSummary>> getErrorList(
            @Parameter(description = "시스템 에러 목록을 검색하기 위한 키워드") ErrorSearchRequest searchRequest,
            @Parameter(description = "페이징 처리에 필요한 정보 객체") Pageable pageable) {
        return ResponseEntity.ok(this.errorService.getErrorList(searchRequest, pageable));
    }

    @GetMapping("/{errorId}")
    @Operation(summary = "시스템 에러의 상세 화면 조회", description = "시스템 에러의 상세 화면을 조회한다")
    @ApiResponse(description = "시스템 에러의 상세 정보")
    public ResponseEntity<ErrorDetail> getError(
            @Parameter(description = "조회할 시스템 에러의 ID")
            @PathVariable String errorId) {
        return ResponseEntity.ok(this.errorService.getErrorDetail(Long.valueOf(errorId)));
    }
}
