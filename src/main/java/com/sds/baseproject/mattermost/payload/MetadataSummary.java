package com.sds.baseproject.mattermost.payload;

import com.sds.baseproject.mattermost.payload.metadata.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class MetadataSummary {
  private List<EmbedSummary> embeds;
  private List<EmojiSummary> emojis;
  private List<FileSummary> files;
  private String images;
  private List<ReactionSummary> reactions;
  private PrioritySummary priority;
  private List<AcknowledgementSummary> acknowledgements;
}
