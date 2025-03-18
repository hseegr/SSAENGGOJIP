package com.sds.baseproject.file.service;

import com.sds.baseproject.file.payload.AttachmentFileSummaryWithStream;
import com.sds.baseproject.file.payload.UploadFileResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collection;

public interface AttachmentFileService {
    UploadFileResponse uploadFile(MultipartFile file, String fileType, String refId) throws IOException;

    AttachmentFileSummaryWithStream getAttachmentFileWithInputStream(String fileId, String fileType) throws IOException;

    void updateFileRefId(String refId, String fileType, Collection<String> fileIds);
}
