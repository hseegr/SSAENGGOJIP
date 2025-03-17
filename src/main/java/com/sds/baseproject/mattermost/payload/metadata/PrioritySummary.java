package com.sds.baseproject.mattermost.payload.metadata;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PrioritySummary {
  private String priority;
  private boolean requestedAck;
}
