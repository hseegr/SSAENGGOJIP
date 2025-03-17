package com.sds.baseproject.board.payload;

import com.sds.baseproject.file.payload.AttachmentFileSummary;
import com.sds.baseproject.user.payload.UserSummarySimple;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class BoardSummary {
    private String boardId;
    private String bbsId;
    private String title;
    private String content;
    private String upperBoardId;
    private UserSummarySimple modUser;
    private OffsetDateTime modDatetime;
    private List<AttachmentFileSummary> attachmentFiles = new ArrayList<>();
}
