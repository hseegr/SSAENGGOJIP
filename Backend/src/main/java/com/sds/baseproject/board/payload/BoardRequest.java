package com.sds.baseproject.board.payload;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class BoardRequest {
    @Schema(example = "제목")
    private String title;
    @Schema(example = "본문")
    private String content;
    private String upperBoardId;
    @Schema(example = "[\"\"]")
    private List<String> attachmentFileIds = new ArrayList<>();
}
