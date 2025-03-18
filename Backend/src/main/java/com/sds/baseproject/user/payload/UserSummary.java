package com.sds.baseproject.user.payload;

import com.sds.baseproject.commoncode.payload.CommonCodeSummarySimple;
import com.sds.baseproject.role.payload.RoleSummarySimple;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class UserSummary {
    private String userId;
    private String loginId;
    private String name;
    private List<RoleSummarySimple> roles = new ArrayList<>();
    private String regionCd;
    private CommonCodeSummarySimple region;
    private String disabledYn;
    private UserSummarySimple regUser;
}
