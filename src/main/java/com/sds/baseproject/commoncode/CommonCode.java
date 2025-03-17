package com.sds.baseproject.commoncode;

/**
 * 공통코드 enum 의 필수 정보를 정의해둔 interface.
 * 해당 interface 를 implement 해야만 CommonCodeController, CommonCodeService 에서 접근하여 리스트를 받아올 수 있다.
 */
public interface CommonCode {
    String getCode();

    String getTitle();

    int getIndex();

    String getOption();
}
