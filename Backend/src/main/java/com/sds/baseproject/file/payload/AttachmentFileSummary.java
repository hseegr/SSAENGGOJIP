package com.sds.baseproject.file.payload;

import lombok.Getter;
import lombok.Setter;

/**
 * 파일의 정보만 담고있는 payload. 실제 파일 데이터는 포함하지 않는다. 리스트 출력용.
 */
@Getter
@Setter
public class AttachmentFileSummary {
    private String fileId;
    private String fileType;
    private String fileName;
    private long fileSize;
    private int orderIdx;
}
