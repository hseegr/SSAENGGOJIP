package com.sds.baseproject.board.entity;

import com.sds.baseproject.common.jpa.converter.BooleanToYNConverter;
import com.sds.baseproject.common.jpa.generator.annotations.PrefixIdGeneratorByDateTime;
import com.sds.baseproject.file.entity.AttachmentFile;
import com.sds.baseproject.user.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;

import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "cm_board")
@Getter
@Setter
public class Board extends BaseEntity {
    @Id
    @PrefixIdGeneratorByDateTime(prefix = "BD")
    private String boardId;

    private String bbsId;

    private String title;

    private String content;

    private String deletedYn = "N";

    @Convert(converter = BooleanToYNConverter.class)
    @Column(name = "deletedYn", updatable = false, insertable = false)
    private boolean deleted;

    private String upperBoardId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "upperBoardId", insertable = false, updatable = false)
    private Board upperBoard;

    @SQLRestriction("DELETED_YN = 'N'")
    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "refId", referencedColumnName = "boardId")
    @OrderBy("orderIdx asc")
    private Set<AttachmentFile> attachmentFiles = new LinkedHashSet<>();
}
