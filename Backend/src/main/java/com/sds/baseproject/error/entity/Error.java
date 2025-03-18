package com.sds.baseproject.error.entity;

import com.sds.baseproject.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.OffsetDateTime;

@Entity
@Table(name = "cm_error")
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class Error {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long errorId;
    String message;
    String stacktrace;

    @CreationTimestamp
    OffsetDateTime regDatetime;

    @CreatedBy
    String regId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "regId", insertable = false, updatable = false)
    User regUser;
}


