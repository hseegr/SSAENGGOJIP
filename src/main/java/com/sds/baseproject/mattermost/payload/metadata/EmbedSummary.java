package com.sds.baseproject.mattermost.payload.metadata;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmbedSummary {
  private String type;
  private String url;
  private String data;
}
