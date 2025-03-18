package com.sds.baseproject.commoncode.controller;

import com.sds.baseproject.commoncode.CommonCodeService;
import com.sds.baseproject.commoncode.payload.CommonCodeSummary;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * Frontend 에서 공통코드를 불러올 수 있도록 제공하는 Controller.
 */
@RestController
@RequestMapping("/api/common-codes")
@RequiredArgsConstructor
@Tag(name= "공통코드 조회", description = "시스템에서 사용하는 공통코드 목록이나 특정 코드에 대한 정보를 조회할 수 있습니다.")
public class CommonCodeController {
    private final CommonCodeService commonCodeService;

    @GetMapping(params = {"key"})
    @Operation(summary = "특정 공통 코드 조회", description = "특정 공통 코드를 조회한다")
    @ApiResponse(description = "특정 공통 코드 정보")
    public List<CommonCodeSummary> getCommonCodeList(
            @Parameter(description = "com.sds.baseproject.commoncode.CommonCode 를 구현한 enum의 이름", example = "\"REGION\"")
            @RequestParam String key) {
        return this.commonCodeService.get(key);
    }

    @GetMapping(params = "keys")
    @Operation(summary = "Map형태로 된 복수의 공통 코드 목록 조회", description = "Map형태로 된 복수의 공통 코드 목록을 조회한다")
    @ApiResponse(description = "Map형태로 된 복수의 공통 코드 목록")
    public Map<String, List<CommonCodeSummary>> getCommonCodeListMap(
            @Parameter(description = "com.sds.baseproject.commoncode.CommonCode 를 구현한 enum의 이름 목록", example = "[\"REGION\"]")
            @RequestParam String[] keys) {
        return this.commonCodeService.get(keys);
    }
}
