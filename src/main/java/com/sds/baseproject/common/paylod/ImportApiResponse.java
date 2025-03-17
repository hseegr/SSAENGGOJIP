package com.sds.baseproject.common.paylod;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * Excel 등 import api를 처리한 응답용도로 사용되는 payload.
 */
@Getter
@Setter
@Builder
public class ImportApiResponse {
    private Boolean success;
    private String message;
    private int totalCount;
    private int insertCount;
    private int updateCount;
    private int deleteCount;
    private int skipCount;
    private int errorCount;
    private String errorMessages;
    private List<String> errorMessageList = new ArrayList<>();

    public void incrementInsert() {
        this.insertCount++;
        this.totalCount++;
    }

    public void incrementUpdate() {
        this.updateCount++;
        this.totalCount++;
    }

    public void incrementDelete() {
        this.deleteCount++;
        this.totalCount++;
    }

    public void incrementSkip() {
        this.skipCount++;
        this.totalCount++;
    }

    public void incrementError() {
        this.errorCount++;
        this.totalCount++;
    }

    public void incrementError(String message) {
        this.errorCount++;
        this.totalCount++;
        this.errorMessageList.add(message);
    }
}
