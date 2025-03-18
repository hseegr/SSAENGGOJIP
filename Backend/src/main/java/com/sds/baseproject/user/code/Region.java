package com.sds.baseproject.user.code;

import com.sds.baseproject.commoncode.CommonCode;

public enum Region implements CommonCode {
    SEOUL("서울"),
    DAEGU("대구");

    private final String title;

    Region(String title) {
        this.title = title;
    }

    @Override
    public String getCode() {
        return name();
    }

    @Override
    public String getTitle() {
        return title;
    }

    @Override
    public int getIndex() {
        return ordinal();
    }

    @Override
    public String getOption() {
        return null;
    }
}
