package com.sds.baseproject.accesscontrol.service;

import com.sds.baseproject.accesscontrol.converter.IpAllowlistConverter;
import com.sds.baseproject.accesscontrol.entity.IpAllowlist;
import com.sds.baseproject.accesscontrol.payload.IpAllowlistRequest;
import com.sds.baseproject.accesscontrol.payload.IpAllowlistSearchRequest;
import com.sds.baseproject.accesscontrol.payload.IpAllowlistSummary;
import com.sds.baseproject.accesscontrol.repository.IpAllowlistRepository;
import com.sds.baseproject.common.paylod.ApiResponse;
import com.sds.baseproject.common.security.userdetails.UserDetailsCacheEvictEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class IpAllowlistServiceImpl implements IpAllowlistService {

  private final IpAllowlistRepository ipAllowlistRepository;
  private final IpAllowlistConverter ipAllowlistConverter;

  private final ApplicationEventPublisher applicationEventPublisher;

  @Override
  @Transactional(readOnly = true)
  public Page<IpAllowlistSummary> getIpAllowlistPage(
      IpAllowlistSearchRequest searchRequest, Pageable pageable) {
    return this.ipAllowlistRepository
        .search(searchRequest, pageable)
        .map(this.ipAllowlistConverter::toIpAddressSummary);
  }

  @Override
  @Transactional
  public ApiResponse saveIpAllowlist(IpAllowlistRequest request) {
    if (this.ipAllowlistRepository.existsByIpAddr(request.getIpAddr())) {
      return new ApiResponse(
          false, HttpStatus.CONFLICT, "The ip address was duplicated", request.getIpAddr());
    }

    IpAllowlist ipAllowlist = this.ipAllowlistConverter.toIpAddress(request);
    ipAllowlist = this.ipAllowlistRepository.save(ipAllowlist);

    this.applicationEventPublisher.publishEvent(
        new UserDetailsCacheEvictEvent(ipAllowlist.getIpAddr()));
    return new ApiResponse(true, HttpStatus.CREATED, "saved", ipAllowlist.getIpAddr());
  }

  @Override
  @Transactional
  public void deleteIpAllowlists(String[] ips) {
    for (String id : ips) {
      ipAllowlistRepository.deleteById(id);
    }
    this.applicationEventPublisher.publishEvent(new UserDetailsCacheEvictEvent(ips));
  }

  @Override
  @Transactional
  public void updateIpAllowlist(IpAllowlistRequest request) {
    IpAllowlist ipAllowlist = this.ipAllowlistRepository.getReferenceById(request.getIpAddr());
    this.ipAllowlistConverter.updateIpAddress(ipAllowlist, request);
    this.applicationEventPublisher.publishEvent(
        new UserDetailsCacheEvictEvent(ipAllowlist.getIpAddr()));
  }
}
