package com.sds.baseproject.accesscontrol.repository;

import com.sds.baseproject.accesscontrol.entity.IpAllowlist;
import com.sds.baseproject.accesscontrol.payload.IpAllowlistSearchRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IpAllowlistRepositoryCustom {
  Page<IpAllowlist> search(IpAllowlistSearchRequest searchRequest, Pageable pageable);
}
