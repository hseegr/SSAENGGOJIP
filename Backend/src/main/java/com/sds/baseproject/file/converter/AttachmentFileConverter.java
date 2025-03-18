package com.sds.baseproject.file.converter;

import com.sds.baseproject.file.entity.AttachmentFile;
import com.sds.baseproject.file.payload.AttachmentFileSummary;
import com.sds.baseproject.file.payload.AttachmentFileSummaryWithStream;
import com.sds.baseproject.file.payload.UploadFileResponse;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AttachmentFileConverter {

    AttachmentFileSummary toAttachmentFileSummary(AttachmentFile attachmentFile);

    AttachmentFileSummaryWithStream toAttachmentFileSummaryWithStream(AttachmentFile attachmentFile);

    UploadFileResponse toResponse(AttachmentFile attachmentFile);

}
