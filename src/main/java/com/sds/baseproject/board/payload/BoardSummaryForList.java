package com.sds.baseproject.board.payload;

import com.sds.baseproject.user.payload.UserSummarySimple;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
public class BoardSummaryForList {
    private String boardId;
    private String title;
    private UserSummarySimple modUser;
    private OffsetDateTime modDatetime;
}
