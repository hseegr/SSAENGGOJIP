package com.sds.baseproject.commoncode.payload;

import com.sds.baseproject.commoncode.CommonCode;
import lombok.Getter;
import lombok.Setter;

/**
 * CommonCode 정보를 제일 기본적인 형태만 전달하기 위한 payload.
 */

@Getter
@Setter
public class CommonCodeSummarySimple {
    private String code;
    private String title;

    public CommonCodeSummarySimple() {
    }

    public CommonCodeSummarySimple(CommonCode commonCode) {
        this.code = commonCode.getCode();
        this.title = commonCode.getTitle();
    }
}
