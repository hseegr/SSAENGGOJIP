package com.sds.baseproject.file.entity;

import com.sds.baseproject.common.jpa.converter.BooleanToYNConverter;
import com.sds.baseproject.user.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "cm_attachment_file")
@Getter
@Setter
public class AttachmentFile extends BaseEntity {
    @Id
    @UuidGenerator
    private String fileId;
    private String fileType;
    private String fileName;
    private long fileSize;
    private String refId;
    private String hash;
    private String mimeType;
    private String deletedYn = "N";
    @Convert(converter = BooleanToYNConverter.class)
    @Column(name = "deletedYn", updatable = false, insertable = false)
    private boolean deleted;
    private int orderIdx;
}
