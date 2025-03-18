package com.sds.baseproject.accesscontrol.payload;

import com.sds.baseproject.user.payload.UserSummarySimple;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
public class IpAllowlistSummary {
  private String ipAddr;
  private String description;
  private UserSummarySimple modUser;
  private OffsetDateTime modDatetime;
}
