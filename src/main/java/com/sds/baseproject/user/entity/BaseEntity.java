package com.sds.baseproject.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.OffsetDateTime;

@EntityListeners(AuditingEntityListener.class)
@MappedSuperclass
@Getter
@Setter
public class BaseEntity {
    @CreationTimestamp
    private OffsetDateTime regDatetime;

    @CreatedBy
    private String regId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "regId", insertable = false, updatable = false)
    private User regUser;

    @UpdateTimestamp
    private OffsetDateTime modDatetime;

    @LastModifiedBy
    private String modId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "modId", insertable = false, updatable = false)
    private User modUser;
}
