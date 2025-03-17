package com.sds.baseproject.mattermost.payload;

import com.sds.baseproject.mattermost.payload.metadata.PrioritySummary;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class MetadataRequest {
  private PrioritySummary priority;
}
