package com.sds.baseproject.accesscontrol.repository;

import com.sds.baseproject.accesscontrol.entity.IpAllowlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IpAllowlistRepository
    extends JpaRepository<IpAllowlist, String>, IpAllowlistRepositoryCustom {
  boolean existsByIpAddr(String ipAddr);
}
