package com.sds.baseproject.role.payload;

import com.sds.baseproject.user.payload.UserSummarySimple;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoleSummary {
  private String roleId;
  private String description;
  private OffsetDateTime modDatetime;
  private UserSummarySimple modUser;
  private List<UserSummarySimple> users = new ArrayList<>();
}
