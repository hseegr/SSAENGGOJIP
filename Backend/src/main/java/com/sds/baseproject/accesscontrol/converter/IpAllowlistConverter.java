package com.sds.baseproject.accesscontrol.converter;

import com.sds.baseproject.accesscontrol.entity.IpAllowlist;
import com.sds.baseproject.accesscontrol.payload.IpAllowlistRequest;
import com.sds.baseproject.accesscontrol.payload.IpAllowlistSummary;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface IpAllowlistConverter {

  IpAllowlistSummary toIpAddressSummary(IpAllowlist ipAllowlist);

  IpAllowlist toIpAddress(IpAllowlistRequest ipAllowlistRequest);

  void updateIpAddress(
      @MappingTarget IpAllowlist ipAllowlist, IpAllowlistRequest ipAllowlistRequest);
}
