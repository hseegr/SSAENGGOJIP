package com.sds.baseproject.file.repository;

import com.sds.baseproject.file.entity.AttachmentFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface AttachmentFileRepository extends JpaRepository<AttachmentFile, String> {
    List<AttachmentFile> findAllByRefIdAndFileTypeAndAndDeleted(String refId, String fileType, boolean deleted);

    List<AttachmentFile> findAllByFileIdIn(Collection<String> fileIds);
}
