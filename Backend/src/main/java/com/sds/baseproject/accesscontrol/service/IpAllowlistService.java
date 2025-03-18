package com.sds.baseproject.accesscontrol.service;

import com.sds.baseproject.accesscontrol.payload.IpAllowlistRequest;
import com.sds.baseproject.accesscontrol.payload.IpAllowlistSearchRequest;
import com.sds.baseproject.accesscontrol.payload.IpAllowlistSummary;
import com.sds.baseproject.common.paylod.ApiResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IpAllowlistService {

  Page<IpAllowlistSummary> getIpAllowlistPage(
      IpAllowlistSearchRequest searchRequest, Pageable pageable);

  ApiResponse saveIpAllowlist(IpAllowlistRequest request);

  void deleteIpAllowlists(String[] ips);

  void updateIpAllowlist(IpAllowlistRequest request);
}
