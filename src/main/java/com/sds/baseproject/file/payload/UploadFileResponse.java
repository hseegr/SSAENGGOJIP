package com.sds.baseproject.file.payload;

import lombok.Getter;
import lombok.Setter;

/**
 * upload 의 결과를 담고있는 payload
 */
@Getter
@Setter
public class UploadFileResponse {
    private String fileId;
    private String fileType;
    private String refId;
    private String fileName;
}
