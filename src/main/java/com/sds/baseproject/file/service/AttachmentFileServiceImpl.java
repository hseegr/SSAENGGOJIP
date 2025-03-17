package com.sds.baseproject.file.service;

import com.sds.baseproject.common.exception.AppException;
import com.sds.baseproject.file.converter.AttachmentFileConverter;
import com.sds.baseproject.file.entity.AttachmentFile;
import com.sds.baseproject.file.payload.AttachmentFileSummaryWithStream;
import com.sds.baseproject.file.payload.UploadFileResponse;
import com.sds.baseproject.file.repository.AttachmentFileRepository;
import com.sds.baseproject.file.storage.FileStorageService;
import com.sds.baseproject.file.util.MimeUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttachmentFileServiceImpl implements AttachmentFileService {
    private final FileStorageService fileStorageService;
    private final AttachmentFileRepository attachmentFileRepository;

    private final AttachmentFileConverter attachmentFileConverter;

    @Override
    public UploadFileResponse uploadFile(MultipartFile file, String fileType, String refId) throws IOException {
        String hash = this.fileStorageService.uploadFile(file);

        AttachmentFile attachmentFile = new AttachmentFile();
        attachmentFile.setFileName(file.getOriginalFilename());
        attachmentFile.setFileSize(file.getSize());
        attachmentFile.setMimeType(MimeUtil.getMimeType(file.getOriginalFilename()));
        attachmentFile.setRefId(refId);
        attachmentFile.setFileType(fileType);
        attachmentFile.setHash(hash);

        attachmentFile = this.attachmentFileRepository.save(attachmentFile);
        return this.attachmentFileConverter.toResponse(attachmentFile);
    }

    @Override
    public AttachmentFileSummaryWithStream getAttachmentFileWithInputStream(String fileId, String fileType) throws IOException {
        AttachmentFile attachmentFile = this.attachmentFileRepository.getReferenceById(fileId);
        if (attachmentFile.isDeleted()) {
            throw new AppException("이미 삭제된 첨부파일입니다.");
        }

        if (!attachmentFile.getFileType().equals(fileType)) {
            throw new AppException("fileType이 일치하지 않습니다.");
        }

        AttachmentFileSummaryWithStream summary = this.attachmentFileConverter.toAttachmentFileSummaryWithStream(attachmentFile);
        summary.setInputStream(this.fileStorageService.getInputStream(attachmentFile.getHash()));
        return summary;
    }

    @Override
    @Transactional
    public void updateFileRefId(String refId, String fileType, Collection<String> fileIds) {
        if (fileIds == null) {
            fileIds = new ArrayList<>();
        }
        HashSet<String> fileIdSet = new HashSet<>(fileIds);
        List<AttachmentFile> fileListByRefId =
                this.attachmentFileRepository.findAllByRefIdAndFileTypeAndAndDeleted(refId, fileType, false);
        for (AttachmentFile attachmentFile : fileListByRefId) {
            if (fileIdSet.contains(attachmentFile.getFileId())) {
                fileIdSet.remove(attachmentFile.getFileId());
            } else {
                attachmentFile.setDeletedYn("Y");
            }
        }

        List<AttachmentFile> fileListToUpdateRefId = this.attachmentFileRepository.findAllByFileIdIn(fileIdSet);
        for (AttachmentFile attachmentFile : fileListToUpdateRefId) {
            attachmentFile.setRefId(refId);
            attachmentFile.setFileType(fileType);
            attachmentFile.setDeletedYn("N");
        }
    }
}
