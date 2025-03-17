package com.sds.baseproject.mattermost.payload;

import java.util.List;
import java.util.Map;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostRequest {
  @Schema(example = "등록할 Mattermost post의 채널 ID")
  private String channelId;
  @Schema(example = "등록할 Mattermost post 메세지")
  private String message;
  private String rootId;
  private List<String> fileIds;
  private Map<String, String> props;
  private MetadataRequest metadata;
}
