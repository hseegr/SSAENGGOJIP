package com.sds.baseproject.file.payload;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.MediaType;
import org.springframework.util.StringUtils;

import java.io.InputStream;

/**
 * 실제 파일의 데이터를 inputStream 에 포함하는 payload.
 */
@Getter
@Setter
public class AttachmentFileSummaryWithStream {
    private String fileId;
    private String fileName;
    private long fileSize;
    private String mimeType;
    private InputStream inputStream;

    public MediaType getMediaType() {
        return StringUtils.hasText(this.mimeType) && this.mimeType.startsWith("image") ?
                MediaType.valueOf(this.mimeType) : MediaType.APPLICATION_OCTET_STREAM;
    }
}
