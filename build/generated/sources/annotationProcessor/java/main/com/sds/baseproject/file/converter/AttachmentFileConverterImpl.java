package com.sds.baseproject.file.converter;

import com.sds.baseproject.file.entity.AttachmentFile;
import com.sds.baseproject.file.payload.AttachmentFileSummary;
import com.sds.baseproject.file.payload.AttachmentFileSummaryWithStream;
import com.sds.baseproject.file.payload.UploadFileResponse;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-03-18T13:02:01+0900",
    comments = "version: 1.5.5.Final, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.7.jar, environment: Java 21.0.5 (Amazon.com Inc.)"
)
@Component
public class AttachmentFileConverterImpl implements AttachmentFileConverter {

    @Override
    public AttachmentFileSummary toAttachmentFileSummary(AttachmentFile attachmentFile) {
        if ( attachmentFile == null ) {
            return null;
        }

        AttachmentFileSummary attachmentFileSummary = new AttachmentFileSummary();

        attachmentFileSummary.setFileId( attachmentFile.getFileId() );
        attachmentFileSummary.setFileType( attachmentFile.getFileType() );
        attachmentFileSummary.setFileName( attachmentFile.getFileName() );
        attachmentFileSummary.setFileSize( attachmentFile.getFileSize() );
        attachmentFileSummary.setOrderIdx( attachmentFile.getOrderIdx() );

        return attachmentFileSummary;
    }

    @Override
    public AttachmentFileSummaryWithStream toAttachmentFileSummaryWithStream(AttachmentFile attachmentFile) {
        if ( attachmentFile == null ) {
            return null;
        }

        AttachmentFileSummaryWithStream attachmentFileSummaryWithStream = new AttachmentFileSummaryWithStream();

        attachmentFileSummaryWithStream.setFileId( attachmentFile.getFileId() );
        attachmentFileSummaryWithStream.setFileName( attachmentFile.getFileName() );
        attachmentFileSummaryWithStream.setFileSize( attachmentFile.getFileSize() );
        attachmentFileSummaryWithStream.setMimeType( attachmentFile.getMimeType() );

        return attachmentFileSummaryWithStream;
    }

    @Override
    public UploadFileResponse toResponse(AttachmentFile attachmentFile) {
        if ( attachmentFile == null ) {
            return null;
        }

        UploadFileResponse uploadFileResponse = new UploadFileResponse();

        uploadFileResponse.setFileId( attachmentFile.getFileId() );
        uploadFileResponse.setFileType( attachmentFile.getFileType() );
        uploadFileResponse.setRefId( attachmentFile.getRefId() );
        uploadFileResponse.setFileName( attachmentFile.getFileName() );

        return uploadFileResponse;
    }
}
