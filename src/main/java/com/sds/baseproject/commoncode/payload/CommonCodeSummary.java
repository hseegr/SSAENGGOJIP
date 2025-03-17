package com.sds.baseproject.commoncode.payload;

import com.sds.baseproject.commoncode.CommonCode;
import lombok.Getter;
import lombok.Setter;

/**
 * CommonCode 의 모든 정보를 전달하기 위한 payload.
 */
@Getter
@Setter
public class CommonCodeSummary {
    private String code;
    private String title;
    private int index;
    private String option;

    public CommonCodeSummary() {
    }

    public CommonCodeSummary(CommonCode commonCode) {
        this.code = commonCode.getCode();
        this.title = commonCode.getTitle();
        this.index = commonCode.getIndex();
        this.option = commonCode.getOption();
    }
}
